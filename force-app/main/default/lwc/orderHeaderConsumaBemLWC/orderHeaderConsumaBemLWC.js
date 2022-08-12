import { LightningElement, api, track, wire } from 'lwc';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import { CurrentPageReference, NavigationMixin } from 'lightning/navigation';

// Import methods
import getAccount                                   from '@salesforce/apex/AccountController.getAccountById';
import getStandardPricebook                         from '@salesforce/apex/PricebookController.getStandardPricebook';
import getAccountAddresses                          from '@salesforce/apex/AccountController.getAccountAddressesByAccountId';
import getPaymentConditions                         from '@salesforce/apex/PaymentConditionsController.getPaymentConditions';
import getPricebookEntry                            from '@salesforce/apex/PricebookEntryController.getPricebookEntry';
import getCustomMetadata                            from '@salesforce/apex/CustomMetadataController.getAgogeLWCMetadata';
import insertOrder                                  from '@salesforce/apex/OrderController.insertOrder';

//import Custom Labels
import ORDER_SPINNER_TEXT                           from '@salesforce/label/c.ORDER_SPINNER_TEXT';
import ORDER_HEADER_PROGRESS_BAR                    from '@salesforce/label/c.ORDER_HEADER_PROGRESS_BAR';
import ORDER_ITEM_PROGRESS_BAR                      from '@salesforce/label/c.ORDER_ITEM_PROGRESS_BAR';
import ORDER_RESUME_PROGRESS_BAR                    from '@salesforce/label/c.ORDER_RESUME_PROGRESS_BAR';
import ORDER_ACCOUNT_NAME                           from '@salesforce/label/c.ORDER_ACCOUNT_NAME';
import ORDER_PRICEBOOK_NAME                         from '@salesforce/label/c.ORDER_PRICEBOOK_NAME';
import ORDER_ACCOUNT_ADDRESSES                      from '@salesforce/label/c.ORDER_ACCOUNT_ADDRESSES';
import ORDER_PAYMENT_CONDITIONS                     from '@salesforce/label/c.ORDER_PAYMENT_CONDITIONS';
import ORDER_PICKLIST_SELECT_AN_OPTION              from '@salesforce/label/c.ORDER_PICKLIST_SELECT_AN_OPTION';
import ORDER_PRODUCT_LIST_PRICE                     from '@salesforce/label/c.ORDER_PRODUCT_LIST_PRICE';
import ORDER_PRODUCT_DISCOUNT                       from '@salesforce/label/c.ORDER_PRODUCT_DISCOUNT';
import ORDER_PRODUCT_QUANTITY                       from '@salesforce/label/c.ORDER_PRODUCT_QUANTITY';
import ORDER_PRODUCT_PRACTICED_PRICE                from '@salesforce/label/c.ORDER_PRODUCT_PRACTICED_PRICE';
import ORDER_PRODUCT_SUBTOTAL                       from '@salesforce/label/c.ORDER_PRODUCT_SUBTOTAL';
import ORDER_SEARCH_PRODUCT                         from '@salesforce/label/c.ORDER_SEARCH_PRODUCT';
import ORDER_SEARCH_PRODUCT_TYPE_HERE               from '@salesforce/label/c.ORDER_SEARCH_PRODUCT_TYPE_HERE';
import ORDER_MININUM_TOTAL_ORDER                    from '@salesforce/label/c.ORDER_MININUM_TOTAL_ORDER';
import ORDER_TOTAL                                  from '@salesforce/label/c.ORDER_TOTAL';
import ORDER_TOTAL_PRACTICE                         from '@salesforce/label/c.ORDER_TOTAL_PRACTICE';
import ORDER_TOTAL_ITENS                            from '@salesforce/label/c.ORDER_TOTAL_ITENS';
import ORDER_EMPTY_CART_TITLE                       from '@salesforce/label/c.ORDER_EMPTY_CART_TITLE';
import ORDER_EMPTY_CART_SUBTITLE                    from '@salesforce/label/c.ORDER_EMPTY_CART_SUBTITLE';
import ORDER_PAYMENT_CONDITION                      from '@salesforce/label/c.ORDER_PAYMENT_CONDITION';
import ORDER_ACCOUNT_ADDRESS                        from '@salesforce/label/c.ORDER_ACCOUNT_ADDRESS';
import ORDER_NOTES_INVOICE                          from '@salesforce/label/c.ORDER_NOTES_INVOICE';
import ORDER_ITEM_PRODUCT_ADDED_CART                from '@salesforce/label/c.ORDER_ITEM_PRODUCT_ADDED_CART';
import ORDER_ACCOUNT_LOADING_ERROR_TOAST            from '@salesforce/label/c.ORDER_ACCOUNT_LOADING_ERROR_TOAST';
import ORDER_PRICEBOOK_LOADING_ERROR_TOAST          from '@salesforce/label/c.ORDER_PRICEBOOK_LOADING_ERROR_TOAST';
import ORDER_ACCOUNT_ADDRESSES_LOADING_ERROR_TOAST  from '@salesforce/label/c.ORDER_ACCOUNT_ADDRESSES_LOADING_ERROR_TOAST';
import ORDER_PAYMENT_CONDITIONS_LOADING_ERROR_TOAST from '@salesforce/label/c.ORDER_PAYMENT_CONDITIONS_LOADING_ERROR_TOAST';
import ORDER_PRICEBOOK_ENTRY_LOADING_ERROR_TOAST    from '@salesforce/label/c.ORDER_PRICEBOOK_ENTRY_LOADING_ERROR_TOAST';
import ORDER_PRODUCT_INVALID_ERROR_TOAST            from '@salesforce/label/c.ORDER_PRODUCT_INVALID_ERROR_TOAST';
import ORDER_REQUIRED_FIELDS_ERROR_TOAST            from '@salesforce/label/c.ORDER_REQUIRED_FIELDS_ERROR_TOAST';
import ORDER_MININUM_TOTAL_ORDER_ERROR_TOAST        from '@salesforce/label/c.ORDER_MININUM_TOTAL_ORDER_ERROR_TOAST';
import ORDER_ERRO_MODAL_TITLE                       from '@salesforce/label/c.ORDER_ERRO_MODAL_TITLE';
import ORDER_ERROR_MODAL_SUBTITLE                   from '@salesforce/label/c.ORDER_ERROR_MODAL_SUBTITLE';



export default class OrderConsumaBemLWC extends NavigationMixin(LightningElement) {

    @api recordId;

    @api TOAST_VARIANT = {
       ERROR   : 'error',
       SUCCESS : 'success',
       WARNING : 'warning'
    }
    
    @api TOAST_TITLE = {
       ERROR   : 'Error',
       SUCCESS : 'Success',
       WARNING : 'Warning'
   }
    
    //Order Hearder
    @track accountName;
    @track pricebookName;
    @track accountAddressName;
    @track paymentConditionName;
    @track accountAddresses  = [];
    @track paymentConditions = [];
    @track accountAddressSelected;
    @track paymentConditionSelected;

    //Pagination
    @track step;
    @track showSpinner   = true;
    @track showFirstPage = true;
    @track showSecondPage;
    @track showThirdPage;

    @track paymentValue;
    @track addressValue;

    //Order Item
    @track pbeList             = [];
    @track pbeListFilter       = [];
    @track productsAddedToCart = [];
    @track totalOrder          = 0;
    @track totalOrderItens     = 0;
    @track minimumTotalOrder   = 0;
    @track totalPraticedOrder  = 0;
    @track noteInvoice         = '';

    //Modal
    @track isShowModal = false;
    @track modalTitle;
    @track modalSubtitle;
    @track modalDescription;



    //custom labels 
    LABEL = {
        //SPINNER
        ORDER_SPINNER_TEXT,

        //PROGRESS BAR
        ORDER_HEADER_PROGRESS_BAR,
        ORDER_ITEM_PROGRESS_BAR,
        ORDER_RESUME_PROGRESS_BAR,

        //ORDER HEADER 
        ORDER_ACCOUNT_NAME, 
        ORDER_PRICEBOOK_NAME,
        ORDER_ACCOUNT_ADDRESSES,
        ORDER_PAYMENT_CONDITIONS,
        ORDER_PICKLIST_SELECT_AN_OPTION,

        //ORDER ITEM
        ORDER_SEARCH_PRODUCT,
        ORDER_SEARCH_PRODUCT_TYPE_HERE,
        ORDER_MININUM_TOTAL_ORDER,
        ORDER_TOTAL,
        ORDER_TOTAL_PRACTICE,
        ORDER_TOTAL_ITENS,
        ORDER_PRODUCT_LIST_PRICE,
        ORDER_PRODUCT_DISCOUNT,
        ORDER_PRODUCT_QUANTITY,
        ORDER_PRODUCT_PRACTICED_PRICE,
        ORDER_PRODUCT_SUBTOTAL,
        ORDER_EMPTY_CART_TITLE,
        ORDER_EMPTY_CART_SUBTITLE,

        //ORDER RESUME
        ORDER_PAYMENT_CONDITION,
        ORDER_ACCOUNT_ADDRESS,
        ORDER_NOTES_INVOICE,
        ORDER_ITEM_PRODUCT_ADDED_CART,

        //TOAST MESSAGES
        ORDER_ACCOUNT_LOADING_ERROR_TOAST,
        ORDER_PRICEBOOK_LOADING_ERROR_TOAST,
        ORDER_ACCOUNT_ADDRESSES_LOADING_ERROR_TOAST,
        ORDER_PAYMENT_CONDITIONS_LOADING_ERROR_TOAST,
        ORDER_PRICEBOOK_ENTRY_LOADING_ERROR_TOAST,
        ORDER_PRODUCT_INVALID_ERROR_TOAST,
        ORDER_REQUIRED_FIELDS_ERROR_TOAST,
        ORDER_MININUM_TOTAL_ORDER_ERROR_TOAST,

        //MODAL
        ORDER_ERRO_MODAL_TITLE,
        ORDER_ERROR_MODAL_SUBTITLE
    };

    connectedCallback() {}


    @wire(CurrentPageReference)
    async setCurrentPageReference(currentPageReference) {
		this.currentPageReference = currentPageReference;
        const { state } = currentPageReference;
        
        if (state) {
			const { c__recordId } = state;
            this.recordId = c__recordId;
        }

        this.showSpinner = true;
        
        await this.setAccountName();
        await this.setStandardPricebook();
        await this.setAccountAddresses();
        await this.setPaymentConditions();
        //await this.setPricebookEntry
        //await this.setMinimumOrderTotal();


        if (this.accountName &&
            this.pricebookName &&
            this.accountAddresses.length > 0 &&
            this.paymentConditions.length > 0
        ) {
            this.showSpinner = false;
        } 
    }

    /* Methods | Order Header Info */
    async setAccountName() {
        let response = await getAccount({
            accountId: this.recordId
        });
        let account = JSON.parse(response.ResponseJSON);

        if (response.HasError || account.length < 1) {
            this.showToastStandard(this.TOAST_TITLE.ERROR, this.LABEL.ORDER_ACCOUNT_LOADING_ERROR_TOAST, this.TOAST_VARIANT.ERROR);
            setTimeout(() => {
                this.navigateToRecordPage(this.recordId, 'Account');
            }, '6000');
        }
        this.accountName = account.Name;
    }

    async setStandardPricebook() {
        let response  = await getStandardPricebook();
        let pricebook = JSON.parse(response.ResponseJSON);

        if (response.HasError || pricebook.length < 1) {
            this.showToastStandard(this.TOAST_TITLE.ERROR, this.LABEL.ORDER_PRICEBOOK_LOADING_ERROR_TOAST, this.TOAST_VARIANT.ERROR);
            setTimeout(() => {
                this.navigateToRecordPage(this.recordId, 'Account');  
            }, '6000');
        }
        this.pricebookName = pricebook.Name;
    }

    async setAccountAddresses() {
        let response = await getAccountAddresses({
            accountId: this.recordId
        });
        this.accountAddresses = JSON.parse(response.ResponseJSON);

        if (response.HasError || this.accountAddresses.length < 1) {
            this.showToastStandard(this.TOAST_TITLE.ERROR, this.LABEL.ORDER_ACCOUNT_ADDRESSES_LOADING_ERROR_TOAST, this.TOAST_VARIANT.ERROR);
            setTimeout(() => {
                this.navigateToRecordPage(this.recordId, 'Account');
            }, '6000'); 
        }
    }

    async setPaymentConditions() {
        let response = await getPaymentConditions();
        this.paymentConditions = JSON.parse(response.ResponseJSON);
        
        if (response.HasError || this.paymentConditions.length < 1) {
            this.showToastStandard(this.TOAST_TITLE.ERROR, this.LABEL.ORDER_PAYMENT_CONDITIONS_LOADING_ERROR_TOAST, this.TOAST_VARIANT.ERROR);
            setTimeout(() => {
                this.navigateToRecordPage(this.recordId, 'Account');
            }, '6000');
        }
    }

    get addressOptions() {
        let options = [];
        this.accountAddresses.forEach(element => {
            options.push({ label: element.FullAddress, value: element.Id });
        });

        return options;
    }

    getSelectedAccountAddress(element) {
        let accountAddressId = element.target.value;
        this.accountAddressSelected = this.accountAddresses.find(item => item.Id == accountAddressId);
        this.accountAddressName     = this.accountAddressSelected != null ? this.accountAddressSelected.FullAddress : '';
        
    }

    get paymentOptions() {
        let options = [];
        this.paymentConditions.forEach(element => {
            options.push({ label: element.Type, value: element.Id });
        });

        return options;
    }

    getSelectedPaymentCondition(element) {
        let paymentConditionId = element.target.value;
        this.paymentConditionSelected = this.paymentConditions.find(item => item.Id == paymentConditionId);
        this.paymentConditionName     = this.paymentConditionSelected != null ? this.paymentConditionSelected.Type : '';
    }


    /* Methods | Order Itens/Cart Info */
    async setPricebookEntry() {
        let response = await getPricebookEntry();
        console.log('response => ', response);
        this.pbeList = JSON.parse(response.ResponseJSON);

        if (response.HasError || this.pbeList.length < 1) {
            this.showToastStandard(this.TOAST_TITLE.ERROR, this.LABEL.ORDER_PRICEBOOK_ENTRY_LOADING_ERROR_TOAST, this.TOAST_VARIANT.ERROR);
            setTimeout(() => {
                this.navigateToRecordPage(this.recordId, 'Account');
            }, '6000');
        }
    }

    handleSearchProducts(event) {
        let searchTerm = event.target.value;
        let results = [];

        if (searchTerm.length > 0) {
            results = this.pbeList.filter(
                pbe => pbe.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       pbe.ProductCode.toLowerCase().includes(searchTerm.toLowerCase())
            );
            this.pbeListFilter = results ? results : [];
        } else {
            this.pbeListFilter = [];
        }
    }

    async setMinimumOrderTotal() {
        let response           = await getCustomMetadata();
        this.minimumTotalOrder = response.MinimumOrderValue__c;
    }

    addProductToCart(element) {
        let pbeId = element.currentTarget.dataset.pbeId;
        let pbe   = this.pbeList.find(item => item.Id == pbeId); 
        
        if (pbe.Quantity < 1 || pbe.PracticedPrice > pbe.ListPrice || pbe.SubTotal < 1) {
            this.showToastStandard(this.TOAST_TITLE.ERROR, this.LABEL.ORDER_PRODUCT_INVALID_ERROR_TOAST, this.TOAST_VARIANT.ERROR);
        } else {
            this.productsAddedToCart.push(pbe);
            pbe.HasAddedToCart = true;

            this.pbeList.forEach((element, index) => {
                if (pbe.Id == element.Id) {
                    this.totalOrder         += pbe.ListPrice * pbe.Quantity;
                    this.totalPraticedOrder += pbe.PracticedPrice * pbe.Quantity;
                    this.totalOrderItens    += parseInt(pbe.Quantity);
                    this.pbeList[index]      = pbe;
                }
            });
        } 
        this.hasProductAddedToCart = this.productsAddedToCart.length > 0 ? true : false;
    }

    removeProductToCart(element) {
        let pbeId = element.currentTarget.dataset.pbeId;
        let pbe   = this.pbeList.find(item => item.Id == pbeId); 
        
        this.productsAddedToCart = this.productsAddedToCart.filter(item => item.Id != pbeId);
        pbe.HasAddedToCart = false;

        this.pbeList.forEach((element, index) => {
            if (pbe.Id == element.Id) {
                this.totalOrder         -= pbe.ListPrice * pbe.Quantity;
                this.totalPraticedOrder -= pbe.PracticedPrice * pbe.Quantity;
                this.totalOrderItens    -= parseInt(pbe.Quantity);
                this.pbeList[index]      = pbe;
            }
        });
        this.hasProductAddedToCart = this.productsAddedToCart.length > 0 ? true : false;
    }

    handleProductQuantity(element) {
        let pbeId = element.currentTarget.dataset.pbeId;
        let pbe   = this.pbeList.find(item => item.Id == pbeId);

        pbe.Quantity = element.target.value;
        pbe.SubTotal = pbe.Quantity < 1 ? 0.0 : pbe.Quantity * pbe.PracticedPrice;
        
        this.pbeList.forEach((element, index) => {
            if (pbe.Id == element.Id) {
                this.pbeList[index] = pbe;
            }
        });
    }

    handlePracticedPrice(element) {
        let pbeId = element.currentTarget.dataset.pbeId;
        let pbe   = this.pbeList.find(item => item.Id == pbeId);
        
        pbe.PracticedPrice = element.target.value;
        pbe.Discount       = pbe.PracticedPrice > 0 ? ((pbe.ListPrice - pbe.PracticedPrice) / pbe.ListPrice) : 0;
        pbe.SubTotal          = pbe.Quantity * pbe.PracticedPrice;

        this.pbeList.forEach((element, index) => {
            if (pbe.Id == element.Id) {
                this.pbeList[index] = pbe;
            }
        });
    }

    /* Methods | Order Resume */
    async insertOrder() {
        if (this.noteInvoice.length < 1) {
            this.showToastStandard(this.TOAST_TITLE.ERROR, this.LABEL.ORDER_REQUIRED_FIELDS_ERROR_TOAST, this.TOAST_VARIANT.ERROR);
        } else {
            let response = await insertOrder({
                accountId     : this.recordId,
                pricebookName : this.pricebookName,
                addressId     : this.accountAddressSelected.Id,
                paymentId     : this.paymentConditionSelected.Id,
                description   : this.noteInvoice,
                orderItens    : JSON.stringify(this.productsAddedToCart)
            });
            console.log(JSON.stringify(response));
            if (!response.HasError) {
                this.showToastResponse(response);
                this.navigateToRecordPage(response.ResponseJSON);
            } else {
                this.modalTitle         = this.LABEL.ORDER_ERRO_MODAL_TITLE;
                this.modalSubtitle      = this.LABEL.ORDER_ERROR_MODAL_SUBTITLE;
                this.modalDescription   = response.Message;
                this.showModalBox();
            }
        }
    }

    handleNoteInvoice(element) {
       this.noteInvoice = element.target.value;
    }


    /* Toast */
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


    /* Pagination */
    nextPage(event) {
        this.setAllStepsToFalse();
        this.step          = event.target.value;
        this.addressValue  = this.accountAddressSelected   != null ? this.accountAddressSelected.Id   : '';
        this.paymentValue  = this.paymentConditionSelected != null ? this.paymentConditionSelected.Id : '';
        this.pbeListFilter = [];
        
        if (this.step === "1") {
           this.showFirstPage  = true;  
        }
        else if (this.step === "2") {
            if (!this.isRequiredFieldsFilled()) {
                this.step           = "1"
                this.showFirstPage  = true; 
                this.showSecondPage = false;
            } else {
                this.setPricebookEntry();
                this.setMinimumOrderTotal();
                this.showSpinner = true;
                setTimeout(() => {
                    this.showSpinner = false;
                }, '1000');
                this.step                  = "2";
                this.showSecondPage        = true;
                this.hasProductAddedToCart = this.productsAddedToCart.length > 0 ? true : false;
            }     
        } else if (this.step === "3") {
            if (this.totalPraticedOrder < this.minimumTotalOrder) {
                this.showToastStandard(this.TOAST_TITLE.ERROR, this.LABEL.ORDER_MININUM_TOTAL_ORDER_ERROR_TOAST, this.TOAST_VARIANT.ERROR);
                this.step = "2";
                this.showSecondPage = true;
                this.showThirdPage  = false;
            } else {
                this.step        = "3";
                this.showSpinner = true;
                setTimeout(() => {
                    this.showSpinner = false;
                }, '1000');
                this.showThirdPage = true;
            }
        }
    }

    previousPage(event) {
        this.setAllStepsToFalse();
        this.step          = event.target.value;
        this.addressValue  = this.accountAddressSelected   != null ? this.accountAddressSelected.Id   : '';
        this.paymentValue  = this.paymentConditionSelected != null ? this.paymentConditionSelected.Id : '';
        this.pbeListFilter = [];

        if (this.step === "1") {
             this.showSpinner = true;
            setTimeout(() => {
                this.showSpinner = false;
            }, '1000');
            this.showFirstPage = true;
        } else if (this.step === "2") {
             this.showSpinner = true;
            setTimeout(() => {
                this.showSpinner = false;
            }, '1000');
            this.showSecondPage = true;
        }
    }

    setAllStepsToFalse() {
        this.showFirstPage  = false;
        this.showSecondPage = false;
        this.showThirdPage  = false;
    }

    isRequiredFieldsFilled() {
        let hasFieldsFilled = this.accountAddressSelected && this.paymentConditionSelected;

        if (!hasFieldsFilled) {
            this.showToastStandard(this.TOAST_TITLE.ERROR, this.LABEL.ORDER_REQUIRED_FIELDS_ERROR_TOAST, this.TOAST_VARIANT.ERROR);
        }
        return hasFieldsFilled;
    }


    /* Modal */     
    showModalBox() {  
        this.isShowModal = true;
    }

    hideModalBox() {  
        this.isShowModal = false;
    }

    
    /* Redirect */
    navigateToRecordPage(recordId, objectApiName) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: recordId,
                objectApiName: objectApiName,
                actionName: 'view'
            }
        });
    }

    navigateToObjectHome() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Account',
                actionName: 'home',
            },
        });
    }

}