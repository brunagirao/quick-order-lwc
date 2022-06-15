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
    public static String getAccountName(String accountId) {

        Account account = [
            SELECT Id, Name
              FROM Account
             WHERE Id =: accountId
             LIMIT 1
        ];

        return account.Name;
    }

    /**
    * Method that get Account Addresses 
    * @param accountId 
    * @return List<AccountAddressResponse> 
    **/
    @AuraEnabled
    public static List<AccountAddressResponse> getAccountAddresses(String accountId){
        
        List<AccountAddressResponse> accountAddressList = new List<AccountAddressResponse>();
        
        for(AccountAddress__c address : [
            SELECT Id, FullAddress__c
              FROM AccountAddress__c
             WHERE Account__c =: accountId
        ]) {
            accountAddressList.add(new AccountAddressResponse(address));
        }

        return accountAddressList;
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

}
