/************************************************************************************************
* Name      : AccountController
* Purpose   : Controller class to Account Object
* Author    : Bruna Girão
* Date      : 15/06/2022  
-------------------------------------------------------------------------------------------

15/06/2022           Bruna Girão         create class 
***************************************************************************************************/
public with sharing class AccountController {
   

    /**
    * Method that get Account Name field
    * @param accountId 
    * @return String 
    **/
    @AuraEnabled
    public static ActionResponse.Response getAccountById(String accountId) {
        try {

            Account account = [
                SELECT Id, Name
                  FROM Account
                 WHERE Id =: accountId
                 LIMIT 1
            ];

            AccountResponse accountResponse = new AccountResponse(account);
            
            ActionResponse.Response response = new ActionResponse.Response(
                false, '', JSON.serialize(accountResponse)
            );
            return response;

        } catch (Exception e) {
            return new ActionResponse.Response(e);
        } 
    }

    /**
    * Method that get Account Addresses 
    * @param accountId 
    * @return List<AccountAddressResponse> 
    **/
    @AuraEnabled
    public static ActionResponse.Response getAccountAddressesByAccountId(String accountId){
        
        try {
            List<AccountAddressResponse> accountAddressResponseList = new List<AccountAddressResponse>();
        
            for(AccountAddress__c address : [
                SELECT Id, FullAddress__c
                  FROM AccountAddress__c
                 WHERE Account__c =: accountId
            ]) {
                accountAddressResponseList.add(new AccountAddressResponse(address));
            }

            ActionResponse.Response response = new ActionResponse.Response(
                false, '', JSON.serialize(accountAddressResponseList)
            );
            return response; 
        } catch (Exception e) {
            return new ActionResponse.Response(e);
        }

    } 

    public static AccountAddress__c getAccountAddress(String accountId, String addressId) {
        
        AccountAddress__c accountAddress = [
            SELECT Id, Name, Street__c, 
                   City__c, State__c, PostalCode__c, 
                   Country__c, Account__c, FullAddress__c
              FROM AccountAddress__c
             WHERE Id         =: addressId
               AND Account__c =: accountId
             LIMIT 1
        ];

        return accountAddress;
    }


    public class AccountResponse {
        @AuraEnabled public String Id   {get; set; }
        @AuraEnabled public String Name {get; set; }

        public AccountResponse(){}

        public AccountResponse(Account account) {
            this.Id   = account.Id;
            this.Name = account.Name;
        }
    }


    public class AccountAddressResponse {
        @AuraEnabled public String Id {get; set; }
        @AuraEnabled public String FullAddress {get; set; }

        public AccountAddressResponse(){}

        public AccountAddressResponse(AccountAddress__c address) {
            this.Id          = address.Id;
            this.FullAddress = address.FullAddress__c;
        }
    }

    public class AccountControllerException extends Exception{}

}
