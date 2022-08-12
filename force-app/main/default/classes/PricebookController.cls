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
    public static ActionResponse.Response getStandardPricebook(){
        
      try {

          Pricebook2 pricebook = [
            SELECT Id, Name 
              FROM Pricebook2
              WHERE IsActive   = true
                AND IsStandard = true
              LIMIT 1
          ];

          PricebookResponse pricebookResponse = new PricebookResponse(pricebook);
          
          ActionResponse.Response response = new ActionResponse.Response(
            false, '', JSON.serialize(pricebookResponse)
          );
          return response;
          
      } catch (Exception e) {
          return new ActionResponse.Response(e);
      }
        
    }

    public static String getStandardPricebookId(){
        
        Pricebook2 pricebook = [
           SELECT Id
             FROM Pricebook2
            WHERE IsActive   = true
              AND IsStandard = true
            LIMIT 1
        ];

        return pricebook.Id;
        
    }

    public class PricebookResponse{
        @AuraEnabled public String Id   {get; set; }
        @AuraEnabled public String Name {get; set; }

        public PricebookResponse(){}

        public PricebookResponse(Pricebook2 pricebook) {
            this.Id   = pricebook.Id;
            this.Name = pricebook.Name;
        }
    }
    
}
