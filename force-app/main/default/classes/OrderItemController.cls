/************************************************************************************************
* Name      : OrderItemController
* Purpose   : Controller class to Order Item Object
* Author    : Bruna Girão
* Date      : 15/06/2022  
-------------------------------------------------------------------------------------------

15/06/2022           Bruna Girão         create class 
***************************************************************************************************/
public with sharing class OrderItemController {
    
    public static void insertOrderItens(String orderId, String orderItens) {
        
        List<OrderItemVO> orderItemVOList = (List<OrderItemVO>) JSON.deserialize(orderItens, List<OrderItemVO>.class);
        List<OrderItem> orderItemList = convertToOrderItem(orderItemVOList);
        
        for(OrderItem orderItem : orderItemList) {
            orderItem.OrderId = orderId;
        }
        insert orderItemList;
    }

    public static List<OrderItem> convertToOrderItem(List<OrderItemVO> orderItemVOList){

        List<OrderItem> orderItemList = new List<OrderItem>();

         for(OrderItemVO orderItemVO : orderItemVOList) {
            orderItemList.add(
                orderItemVO.getOrderItem()
            );
        }
        return orderItemList;
    }

    public class OrderItemVO {
        public String  Id               {get; set;}
        public String  Discount         {get; set;}
        public Boolean IsActive         {get; set;}
        public Decimal ListPrice        {get; set;}
        public String  ProductName      {get; set;}
        public Decimal PracticedPrice   {get; set;}
        public String  Pricebook2Id     {get; set;}
        public String  Product2Id       {get; set;}
        public String  ProductCode      {get; set;}
        public Decimal Quantity         {get; set;}
        public String  SubTotal         {get; set;}

        public OrderItemVO(){}

        public OrderItem getOrderItem() {
            OrderItem orderItem = new OrderItem(
                Product2Id       = this.Product2Id,
                Quantity         = this.Quantity,
                UnitPrice        = this.PracticedPrice,
                PricebookEntryId = this.Id
            );

            return orderItem;
        }
    }
}
