/************************************************************************************************
* Name      : PaymentConditionsController
* Purpose   : Controller class to PaymentConditions__c Object
* Author    : Bruna Girão
* Date      : 15/06/2022  
-------------------------------------------------------------------------------------------

15/06/2022           Bruna Girão         create class 
***************************************************************************************************/
public with sharing class PaymentConditionsController {
    
    @AuraEnabled
    public static List<PaymentConditionsResponse> getPaymentConditions(){
        List<PaymentConditionsResponse> paymentConditionList = new List<PaymentConditionsResponse>();

        for(PaymentCondition__c condition : [
            SELECT Id, Type__c
              FROM PaymentCondition__c
          ORDER BY Type__c
        ]) {
            paymentConditionList.add(new PaymentConditionsResponse(condition));
        }

        return paymentConditionList;
    }

    public class PaymentConditionsResponse {
        @AuraEnabled public String Id {get; set;}
        @AuraEnabled public String Type {get; set;}

        public PaymentConditionsResponse(){}

        public PaymentConditionsResponse(PaymentCondition__c condition){
            this.Id   = condition.Id;
            this.Type = condition.Type__c;
        }
    }
}
