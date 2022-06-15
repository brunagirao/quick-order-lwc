import { LightningElement, api, track, wire } from 'lwc';

import getAccountName from '@salesforce/apex/AccountController.getAccountName';
import getAccountAddresses from '@salesforce/apex/AccountController.getAccountAddresses';

export default class OrderConsumaBemLWC extends LightningElement {

    @api recordId;
    @track accountName;
    @track accountAddresses = [];

    connectedCallback() {

        console.log('GET ACCOUNT DATA | ID => ', this.recordId);
        this.getAccountName();
        this.getAccountAddresses();
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

    
}