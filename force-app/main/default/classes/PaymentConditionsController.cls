/************************************************************************************************
* Name      : PaymentConditionsController
* Purpose   : Controller class to PaymentConditions__c Object
* Author    : Bruna Girão
* Date      : 15/06/2022  
-------------------------------------------------------------------------------------------

15/06/2022           Bruna Girão         create class 
***************************************************************************************************/
public with sharing class PaymentConditionsController {
    
    /**
    * Method that get Payment Conditions of the Org
    * @return List<PaymentConditionsResponse> 
    **/
    @AuraEnabled
    public static ActionResponse.Response getPaymentConditions(){

        try {
            List<PaymentConditionsResponse> paymentConditionResponseList = new List<PaymentConditionsResponse>();

            for(PaymentCondition__c condition : [
                 SELECT Id, Type__c
                   FROM PaymentCondition__c
               ORDER BY Type__c
            ]) {
                paymentConditionResponseList.add(new PaymentConditionsResponse(condition));
            }

            ActionResponse.Response response = new ActionResponse.Response(
                false, '', JSON.serialize(paymentConditionResponseList)
            );
            return response; 
                
        } catch (Exception e) {
            return new ActionResponse.Response(e);
        }
    }

    public static PaymentCondition__c getPaymentCondition(String paymentConditionId) {

        PaymentCondition__c condition = [
            SELECT Id, Type__c
              FROM PaymentCondition__c
             WHERE Id =: paymentConditionId
             LIMIT 1
         ];

         return condition;
    }

    public class PaymentConditionsResponse {
        @AuraEnabled public String Id   {get; set;}
        @AuraEnabled public String Type {get; set;}

        public PaymentConditionsResponse(){}

        public PaymentConditionsResponse(PaymentCondition__c condition){
            this.Id   = condition.Id;
            this.Type = condition.Type__c;
        }
    }
}
