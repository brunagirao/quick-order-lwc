/************************************************************************************************
* Name      : ContractController
* Purpose   : Controller class to Contract Object
* Author    : Bruna Girão
* Date      : 15/06/2022  
-------------------------------------------------------------------------------------------

15/06/2022           Bruna Girão         create class 
***************************************************************************************************/
public with sharing class ContractController {
    
    public static Contract getContractController(String accountId) {

        Contract contract = [
            SELECT Id
              FROM Contract
             WHERE AccountId =: accountId
             LIMIT 1
        ];

        contract = contract == null ? createContract(accountId) : contract;

        return contract;
    }

    public static Contract createContract(String accountId) {
        
        Contract contract = new Contract (
            AccountId     = accountId,
            ContractTerm  = 6,
            Status        = 'Draft',
            StartDate     = Date.today()
        );

        insert contract;

        return contract;
    }
}
