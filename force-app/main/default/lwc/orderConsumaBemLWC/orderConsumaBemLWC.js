import { LightningElement, api, track, wire } from 'lwc';

import getAccountName from '@salesforce/apex/AccountController.getAccountName';
import getAccountAddresses from '@salesforce/apex/AccountController.getAccountAddresses';
import getPaymentConditions from '@salesforce/apex/PaymentConditionsController.getPaymentConditions';

export default class OrderConsumaBemLWC extends LightningElement {

    @api recordId;
    @track accountName;
    @track accountAddresses  = [];
    @track paymentConditions = [];

    connectedCallback() {

        console.log('GET ACCOUNT DATA | ID => ', this.recordId);
        this.getAccountName();
        this.getAccountAddresses();
        this.getPaymentConditions();
    }

    
    async getAccountName() {

        let response = await getAccountName({
            accountId: this.recordId
        });

        this.accountName = response;
    }

    async getAccountAddresses() {

        let response = await getAccountAddresses({
            accountId: this.recordId
        });
        console.log('Response => ', response);
        this.accountAddresses = response;

    }

    async getPaymentConditions() {
        let response = await getPaymentConditions();
        this.paymentConditions = response;
    }

    
}