/************************************************************************************************
* Name      : OrderController
* Purpose   : Controller class to Order Object
* Author    : Bruna Girão
* Date      : 15/06/2022  
-------------------------------------------------------------------------------------------

15/06/2022           Bruna Girão         create class 
***************************************************************************************************/
public with sharing class OrderController {
    
    @AuraEnabled
    public static ActionResponse.Response insertOrder(String accountId, String pricebookName, String addressId, String paymentId, String description, String orderItens){
        try {

            //verifico se as informações vieram preenchidas
            if(String.isBlank(accountId) || String.isBlank(pricebookName) || String.isBlank(addressId) || String.isBlank(paymentId)) {
                throw new OrderControllerException(System.Label.ORDER_HEADER_DATA_EXCEPTION);
            }

            //pego as informações do endereço selecionado
            AccountAddress__c accountAddress = AccountController.getAccountAddress(accountId, addressId);
            if(accountAddress == null) {
                throw new OrderControllerException(System.Label.ORDER_ACCOUNT_ADDRESS_EXCEPTION);
            }

            //pego as informações da condição de pagamento selecionada
            PaymentCondition__c paymentCondition = PaymentConditionsController.getPaymentCondition(paymentId);
            if(paymentCondition == null) {
                throw new OrderControllerException(System.Label.ORDER_PAYMENT_CONDITION_EXCEPTION);
            }

            //pego as informação do contrato
            Contract contract = ContractController.getContractController(accountId);
            if(contract == null) {
                throw new OrderControllerException(System.Label.ORDER_CONTRACT_EXCEPTION);
            }

            //crio a ordem
            Order order = new Order(
                AccountId           = accountId,
                EffectiveDate       = Date.today(),
                Status              = 'Draft',
                PaymentCondition__c = paymentCondition.Id,
                ContractId          = contract.Id,
                Description         = String.isNotBlank(description) ? description : '', 
                Pricebook2Id        = PricebookController.getStandardPricebookId(),
                ShippingCity        = accountAddress.City__c,
                ShippingCountry     = accountAddress.Country__c,
                ShippingPostalCode  = accountAddress.PostalCode__c,
                ShippingState       = accountAddress.State__c,
                ShippingStreet      = accountAddress.Street__c
            );
            insert order;

            //crio os itens da ordem
            OrderItemController.insertOrderItens(order.Id, orderItens);

            String orderNumber = [SELECT OrderNumber FROM Order WHERE Id =: order.Id LIMIT 1].OrderNumber;
            
            ActionResponse.Response response = new ActionResponse.Response(
                false, System.Label.ORDER_SAVE_SUCCESS + ' ' + orderNumber, order.Id
             );
             return response;

        } catch (Exception e) {
            return new ActionResponse.Response(e.getDmlMessage(0));
        }
    }

    public class OrderControllerException extends Exception{}
}
