import { Expense } from '@/model/Expense';
import * as SecureStore from 'expo-secure-store';

export type Bank = {
    id: string
    name: string
}

export type Requisition = {
    id: string
    status: string
    link: string
}

export type Account = {
    resourceId: string
    name: string
    uuid: string
}

export async function validateToken(secretId: string, secretKey: string): Promise<string> {
    return fetch('https://bankaccountdata.gocardless.com/api/v2/token/new/', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            secret_id: secretId,
            secret_key: secretKey,
        }),
    }).then(response => response.json())
        .then(json => {
            if (json.status_code !== undefined) {
                console.log(json)
                throw `${json.summary} : ${json.detail}`;
            }
            save('token', json.access);
            return json.access;
        })

}

export async function getBankList(token: string): Promise<Bank[]> {
    return fetch('https://bankaccountdata.gocardless.com/api/v2/institutions/?country=fr', {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        }
    }).then(response => response.json())
        .then(json => {
            if (json.status_code !== undefined) {
                throw `${json.summary} : ${json.detail}`;
            }
            if (json instanceof Array) {
                return json.map(obj => {
                    return { id: obj.id, name: obj.name } as Bank
                });
            }
            else {
                console.log(json)
                throw 'Impossible de parser le JSON'
            }
        });
}

export async function getRequisitionLink(token: string, bankId: string): Promise<Requisition> {
    return SecureStore.getItemAsync(`requisition${bankId}`)
        .then(value => {
            if (value === null) {
                console.log(`no requisiton existing for bank:${bankId}`)
                return fetchRequisitionLink(token, bankId);
            } else {
                console.log(`using stored requisition : ${value}`)
                return { id: value } as Requisition
            }
        })
        .catch(reason => {
            console.log(`cannot find requisition:${bankId} : ${reason}`)
            return fetchRequisitionLink(token, bankId);
        })
}
async function fetchRequisitionLink(token: string, bankId: string): Promise<Requisition> {
    return fetch('https://bankaccountdata.gocardless.com/api/v2/requisitions/', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            redirect: 'http://localhost',
            institution_id: bankId,
            account_selection: true
        }),
    }).then(response => response.json())
        .then(json => {
            save(`requisition${bankId}`, json.id);
            return { id: json.id, status: json.status, link: json.link, } as Requisition;
        });
}

async function save(key: string, value: string) {
    await SecureStore.setItemAsync(key, value);
}

export async function getAccountsList(token: string, requisitionId: string): Promise<Account[]> {
    return fetch(`https://bankaccountdata.gocardless.com/api/v2/requisitions/${requisitionId}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        }
    }).then(response => response.json())
        .then(json => {
            console.log(json)
            return Promise.all(json.accounts.map(
                (accountUUID: any) => getAccountDetails(token, accountUUID)
            ))
        });
}

async function getAccountDetails(token: string, accountUUID: string): Promise<Account> {
    return fetch(`https://bankaccountdata.gocardless.com/api/v2/accounts/${accountUUID}/details`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        }
    }).then(response => response.json())
        .then(json => {
            if (json.status_code !== undefined) {
                throw `${json.summary} : ${json.detail}`;
            }
            return { ...json.account, uuid: accountUUID } as Account
        });
}

export async function importExpensesFromAccount(token: string, accountId: string): Promise<Expense[]> {
    return fetch(`https://bankaccountdata.gocardless.com/api/v2/accounts/c1095900-d7c2-42c8-b970-c41cbec58599/transactions`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        }
    }).then(response => response.json())
        .then(json => {
            if (json.status_code !== undefined) {
                throw `${json.summary} : ${json.detail}`;
            }
            return toExpenses(json.transactions.booked)
        });
}

function toExpenses(transactionList: Array<any>): Expense[] {
    return transactionList.map(
        transaction => {
            console.log(transaction)
            return new Expense(new Date(transaction.valueDate), transaction.remittanceInformationUnstructuredArray[0], transaction.transactionAmount.amount, [])
        }
    )
}
