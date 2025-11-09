import { Expense } from "@/model/Expense";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";
import { Buffer } from "buffer";
import { retrieveInsecure, saveInsecure, saveSecure } from "./StorageHelper";

export type Bank = {
    id: string;
    name: string;
};

export type Requisition = {
    id: string;
    status: string;
    link: string;
};

export type Account = {
    resourceId: string;
    name: string;
    uuid: string;
};

export type Token = {
    value: string;
    ttl: number;
};

export type SecretCreds = {
    id: string;
    key: string;
};

export async function validateToken(secret: SecretCreds): Promise<string> {
    return SecureStore.getItemAsync("token").then((token) => {
        if (token === null || isTokenExpired(token)) {
            console.log("token is expired");
            return fetchToken(secret);
        } else {
            console.log("got token from local storage");
            return token;
        }
    });
}

async function fetchToken(secret: SecretCreds): Promise<string> {
    return fetch("https://bankaccountdata.gocardless.com/api/v2/token/new/", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            secret_id: secret.id,
            secret_key: secret.key,
        }),
    })
        .then((response) => response.json())
        .then((json) => {
            if (json.status_code !== undefined) {
                console.error(json);
                throw `${json.summary} : ${json.detail}`;
            }
            console.log("fetched token");
            saveSecure("token", json.access);
            return json.access;
        });
}

export async function getBankList(secret: SecretCreds): Promise<Bank[]> {
    return makeRequest(
        secret,
        "https://bankaccountdata.gocardless.com/api/v2/institutions/?country=fr",
        "GET",
        {},
        (json) => {
            if (json instanceof Array) {
                return json.map((obj) => {
                    return { id: obj.id, name: obj.name } as Bank;
                });
            } else {
                console.log(json);
                throw "Impossible de parser le JSON";
            }
        },
    );
}

export async function getRequisitionLink(secret: SecretCreds, bankId: string): Promise<Requisition> {
    return retrieveInsecure(`requisition${bankId}`)
        .then((value) => {
            if (value === null) {
                console.log(`no requisiton existing for bank:${bankId}`);
                return fetchRequisitionLink(secret, bankId);
            } else {
                console.log(`using stored requisition`);
                return { id: value.id, status: value.status, link: value.link } as Requisition;
            }
        })
        .catch((reason) => {
            console.log(`cannot find requisition:${bankId} : ${reason}`);
            return fetchRequisitionLink(secret, bankId);
        });
}
async function fetchRequisitionLink(secret: SecretCreds, bankId: string): Promise<Requisition> {
    return validateToken(secret).then((token) =>
        fetch("https://bankaccountdata.gocardless.com/api/v2/requisitions/", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                redirect: "ovh.yanck.suivifactures://gocardless-setup",
                institution_id: bankId,
                account_selection: true,
            }),
        })
            .then((response) => response.json())
            .then((json) => {
                let requisition = { id: json.id, status: json.status, link: json.link } as Requisition;
                saveInsecure(`requisition${bankId}`, requisition);
                return requisition;
            }),
    );
}

export async function getAccountsList(secret: SecretCreds, requisitionId: string): Promise<Account[]> {
    return makeRequest(
        secret,
        `https://bankaccountdata.gocardless.com/api/v2/requisitions/${requisitionId}`,
        "GET",
        {},
        (json) => {
            //TODO status expiré ?
            console.log(json);
            if (json.status !== "LN") {
                Alert.alert(
                    "Banque non validée",
                    "Avant de pouvoir générer la liste des comptes, il faut authoriser l'application via votre banque. Cliquer sur le bouton Étape 4 et suivez les instructions",
                );
                return [];
            }
            console.log(json);
            return Promise.all(json.accounts.map((accountUUID: any) => getAccountDetails(secret, accountUUID)));
        },
    );
}

export async function getRequisitionStatus(secret: SecretCreds, requisitionId: string): Promise<string> {
    return makeRequest(
        secret,
        `https://bankaccountdata.gocardless.com/api/v2/requisitions/${requisitionId}`,
        "GET",
        {},
        (json) => json.status as string,
    );
}

async function makeRequest<T>(
    secret: SecretCreds,
    url: string,
    method: string,
    headers: any,
    consume: (json: any) => T,
): Promise<T> {
    return validateToken(secret).then((token) =>
        fetch(url, {
            method: method,
            headers: {
                ...headers,
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((json) => {
                if (json.status_code !== undefined) {
                    console.error(json);
                    throw `${json.summary} : ${json.detail}`;
                }
                return consume(json);
            }),
    );
}

async function getAccountDetails(secret: SecretCreds, accountUUID: string): Promise<Account> {
    return makeRequest(
        secret,
        `https://bankaccountdata.gocardless.com/api/v2/accounts/${accountUUID}/details`,
        "GET",
        {},
        (json) => {
            return { ...json.account, uuid: accountUUID } as Account;
        },
    );
}

export async function importExpensesFromAccount(secret: SecretCreds, accountId: string): Promise<Expense[]> {
    return makeRequest(
        secret,
        `https://bankaccountdata.gocardless.com/api/v2/accounts/${accountId}/transactions`,
        "GET",
        {},
        (json) => toExpenses(json.transactions.booked),
    );
}

function toExpenses(transactionList: Array<any>): Expense[] {
    return transactionList.map((transaction) => {
        console.log(transaction);
        return new Expense(
            new Date(transaction.valueDate),
            transaction.remittanceInformationUnstructuredArray[0],
            transaction.transactionAmount.amount,
            [],
        );
    });
}

function isTokenExpired(jwt: string): boolean {
    let token = JSON.parse(decode(jwt.split(".")[1]));
    return Date.now() >= new Date(token.exp * 1000).getTime();
}
function decode(str: string): string {
    return Buffer.from(str, "base64").toString("binary");
}
