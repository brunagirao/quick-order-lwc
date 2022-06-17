/************************************************************************************************
* Name      : PricebookController
* Purpose   : Controller class to Pricebook2 Object
* Author    : Bruna Girão
* Date      : 15/06/2022  
-------------------------------------------------------------------------------------------

15/06/2022           Bruna Girão         create class 
***************************************************************************************************/
public with sharing class PricebookController {
    
    /**
    * Method that get the Standard Pricebook from Org
    * @return String 
    **/
    @AuraEnabled
    public static String getStandardPricebook(){
        
        Pricebook2 pricebook = [
            SELECT Id, Name 
              FROM Pricebook2
             WHERE IsStandard = true
               AND IsActive = true
             LIMIT 1
        ];
        
        return pricebook.Name;
    }

    
}
