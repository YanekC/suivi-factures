import { Expense } from "@/model/Expense";
import { Pressable, StyleSheet, Text } from "react-native";
import FileCell from "./FileCell";
import { Component } from "react";

type Props = {
    expense: Expense;
    multipleSelectMode: boolean;
    setMultipleSelectMode: (mode: boolean) => void;
    selectedExpenses: Set<string>;
    setSelectedExpenses: (expenses: Set<string>) => void;
};

const styles = StyleSheet.create({
    itemView: {
        backgroundColor: "lavender",
        borderBottomWidth: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    text: {
        fontSize: 13,
        padding: 5,
        flexWrap: "nowrap",
    },
});

export class ExpenseRow extends Component<Props, { selected: boolean }> {
    constructor(props: Props) {
        super(props);
    }

    shouldComponentUpdate(nextProps: Props): boolean {
        const propsChanged =
            this.props.expense.id !== nextProps.expense.id ||
            this.props.expense.title !== nextProps.expense.title ||
            this.props.expense.amount !== nextProps.expense.amount ||
            this.props.expense.date !== nextProps.expense.date ||
            this.props.expense.noFile !== nextProps.expense.noFile ||
            this.props.expense.attachedFiles !== nextProps.expense.attachedFiles;

        const backGroundNeedsUpdate = nextProps.multipleSelectMode === false && this.isSelected();

        const selectionChanged = this.isSelected() !== nextProps.selectedExpenses.has(nextProps.expense.id);

        return propsChanged || selectionChanged || backGroundNeedsUpdate;
    }

    isSelected() {
        return this.props.selectedExpenses.has(this.props.expense.id);
    }

    setSelected(value: boolean) {
        if (value) {
            this.props.setSelectedExpenses(new Set(this.props.selectedExpenses).add(this.props.expense.id));
        } else {
            //Remove expense from selected expenses
            let newSet = new Set(this.props.selectedExpenses);
            newSet.delete(this.props.expense.id);
            this.props.setSelectedExpenses(newSet);
        }
    }

    getBackgroundColor() {
        if (this.isSelected() && this.props.multipleSelectMode) {
            return "#C7B8E8";
        } else {
            return "lavender";
        }
    }

    handleLongPress = () => {
        this.setSelected(true);
        this.props.setMultipleSelectMode(true);
    };

    handlePress = () => {
        if (this.props.multipleSelectMode) {
            this.setSelected(!this.isSelected());
        }
    };

    render() {
        return (
            <Pressable
                style={[styles.itemView, { backgroundColor: this.getBackgroundColor() }]}
                onLongPress={this.handleLongPress}
                onPress={this.handlePress}
            >
                <Text style={[styles.text, { flex: 1 }]}>{this.props.expense.getHumanReadableDate()}</Text>
                <Text style={[styles.text, { flex: 10 }]}>{this.props.expense.title}</Text>
                <Text style={[styles.text, { flex: 3, textAlign: "right" }]}>
                    {this.props.expense.amount.toString()} €
                </Text>
                <FileCell
                    expenseFiles={this.props.expense.attachedFiles}
                    expenseId={this.props.expense.id}
                    noFileNeeded={this.props.expense.noFile}
                />
            </Pressable>
        );
    }
}
