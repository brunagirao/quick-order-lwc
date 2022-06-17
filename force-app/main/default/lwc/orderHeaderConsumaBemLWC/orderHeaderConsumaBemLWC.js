import { LightningElement, api, track, wire } from 'lwc';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import getAccountName from '@salesforce/apex/AccountController.getAccountName';
import getAccountAddresses from '@salesforce/apex/AccountController.getAccountAddresses';
import getPaymentConditions from '@salesforce/apex/PaymentConditionsController.getPaymentConditions';
import getStandardPricebook from '@salesforce/apex/PricebookController.getStandardPricebook';

export default class OrderConsumaBemLWC extends LightningElement {

    @api recordId;
    @track accountName              = '';
    @track pricebookName            = '';
    @track accountAddresses         = [];
    @track paymentConditions        = [];
    @track accountAddressSelected   = {};
    @track paymentConditionSelected = {};

    connectedCallback() {
        this.getAccountName();
        this.getAccountAddresses();
        this.getPaymentConditions();
        this.getStandardPricebook();
    }

    
    async getAccountName() {

        let response = await getAccountName({
            accountId: this.recordId
        });
        console.log('getAccountName response => ', response);
        this.accountName = response;
    }

    async getAccountAddresses() {

        let response = await getAccountAddresses({
            accountId: this.recordId
        });
        console.log('getAccountAddresses response => ', response);
        this.accountAddresses = response;

    }

    async getPaymentConditions() {
        let response = await getPaymentConditions();
        console.log('getPaymentConditions response => ', response);
        this.paymentConditions = response;
    }

    async getStandardPricebook() {
        let response = await getStandardPricebook();
        console.log('getStandardPricebook response => ', response);
        this.pricebookName = response;
    }

    getSelectedAccountAddress(element) {
        let accountAddressId = element.target.value;
        console.log('getSelectedAccountAddress  => ', accountAddressId);
        this.accountAddressSelected = this.accountAddresses.find(item => item.Id == accountAddressId);
        console.log('accountAddressSelected  => ', this.accountAddressSelected.FullAddress);
    }

    getSelectedPaymentCondition(element) {
        let paymentConditionId = element.target.value;
        console.log('getSelectedPaymentCondition  => ', paymentConditionId);
        this.paymentConditionSelected = this.paymentConditions.find(item => item.Id == paymentConditionId);
        console.log('paymentConditionSelected  => ', this.paymentConditionSelected.Type);
    }

    isRequiredFieldsFilled() {

        let isFieldsFilled =
            this.accountName.length   > 0 &&
            this.pricebookName.length > 0 && 
            Boolean(
                (this.accountAddressSelected   && this.accountAddressSelected.Id   && this.accountAddressSelected.FullAddress) &&
                (this.paymentConditionSelected && this.paymentConditionSelected.Id && this.paymentConditionSelected.Type)
            );
        
        console.log('isFieldsFilled => ', isFieldsFilled);

        return isFieldsFilled;
    }

    handleNext() {
        console.log('this.isRequiredFieldsFilled() => ', this.isRequiredFieldsFilled());
        if (!this.isRequiredFieldsFilled()) {
            console.log('Mostrar')
            this.showToastStandard('Erro', 'Os campos obrigatórios devem estar preenchidos', 'error');
        }
    }

    showToastStandard(title, message, variant) {
        const event = new ShowToastEvent({
            title,
            message,
            variant
        });
        this.dispatchEvent(event);
    }

    showToastResponse(response) {
        const event = new ShowToastEvent({
            title   : response.ToastInfo.Title,
            message : response.ToastInfo.Message,
            variant : response.ToastInfo.Type
        });
        this.dispatchEvent(event);
    }

    
}