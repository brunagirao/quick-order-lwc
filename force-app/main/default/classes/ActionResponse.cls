public with sharing class ActionResponse {
    public ActionResponse() {}

    public class ToastInfo {
        @AuraEnabled public String Title   {get; set;}
        @AuraEnabled public String Message {get; set;}
        @AuraEnabled public String Type    {get; set;}

        public ToastInfo(String title, String message, String type) {
            this.Title   = title;  
            this.Message = message;
            this.Type    = type;  
        }
    }

    public class Response {

        @AuraEnabled public Boolean HasError      {get; set;}
        @AuraEnabled public Boolean BusinessError {get; set;}
        @AuraEnabled public String Message        {get; set;}
        @AuraEnabled public String ResponseJSON   {get; set;}
        @AuraEnabled public ToastInfo ToastInfo   {get; set;}

        public Response (Boolean businessError, String message, String responseJSON) {
            this.HasError       = businessError;
            this.BusinessError  = businessError;
            this.Message        = message;
            this.ResponseJSON   = responseJSON;
            this.fillToast ();
        }

        public Response (Exception e) {
            this.HasError       = true;
            this.businessError  = false;
            this.Message        = e.getMessage();
            this.ResponseJSON   = '';
            this.fillToast ();

        }

        public Response (String exMessage) {
            this.HasError       = true;
            this.businessError  = false;
            this.Message        = exMessage;
            this.ResponseJSON   = '';
            this.fillToast ();

        }

        public void fillToast () {
            if (!this.HasError) {
                this.ToastInfo = new ToastInfo ('Success', this.Message, 'success');
            } 
            else if (this.BusinessError) {
                this.ToastInfo = new ToastInfo ('Alert', this.Message, 'warning');
            }
            else {
                this.ToastInfo = new ToastInfo ('Error', this.Message, 'error');
            }
        }
    }
}
