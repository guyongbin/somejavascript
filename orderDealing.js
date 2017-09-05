/* 
 * 处理中订单-成本确认js
 * add by Guyongbin 2013年1月19日 15:58:46
 */ 
$(document).ready(function(){   
    //隐藏安装费销售单价文本框 
    $("#selectedProductsTable tr").each(function(i){ 
        var pid = $(this).find("input[valueType='pid']").val();
        if( pid == $("#hid_an_zhuang_fei_id").val()){
            $(this).children("td:eq(5)").html($(this).children("td:eq(4)").html());
            $(this).children("td:eq(6)").html('');
        }  
    }); 
    //计算实际成本总价
    calculateCostPrice(); 
    
    //页面验证
    var  validate= $("#contenform").validate(); 
    
    //处理订单事件
    $("#btnDealing").click(function() {   
        var validResult = setOrderValueAndValid();  
        var dataContent={ 
            'hid_ids': $("#hid_ids").val(),//询价明细单IDs 
            'hid_suppliers': $("#hid_suppliers").val(),//供应商明细单IDs 
            "hid_costPrice":parseFloat($("#hid_costPrice").val()).toFixed(4),//参考成本价总价 
            "hid_costPrices":$("#hid_costPrices").val(),//参考成本价明细  
            "hid_operate_note": $("#operate_note").val(),//操作备注   
            "hid_orderId": $("#hid_orderID").val(),//订单ID 
            "hid_profitability":parseFloat($("#hid_ProfitRate‎").val()).toFixed(4)//利益率 
        };   
        $.ajax({
            type: "POST",
            url: $("#hid_path_Dealing").val(),
            data: dataContent,  
            beforeSend: function()
            {   
                if(validate.valid()){
                    // $("#btnSubmit").attr("disabled","disabled"); 
                    $("input[type='button']").attr("disabled","disabled"); 
                    if(validResult==''){    
                        return true;
                    }else{
                        alert(validResult); 
                        $("input[type='button']").removeAttr("disabled");
                        return false;
                    } 
                }else{ 
                    $("input[type='button']").removeAttr("disabled");  
                    return false;
                }    
            },
            success: function(msg){  
                $("input[type='button']").removeAttr("disabled"); 
                var result = JSON.parse(msg); 
                if(result.result ==1){
                    alert(result.content); 
                    location.href=$("#hid_path_DealingList").val();
                }
                else{ 
                    alert(result.content)
                }       
            } 
        });
    });   
});


//计算利益率
function calculateprofitability(){
    
    var totaldetailTotalIncTax= parseFloat($("#hid_detailTotalIncTax").val());//软硬件总售价
    var totalCostPrice = parseFloat($("#hid_costPrice").val());//软硬件总成本价
    var installFee = parseFloat($("#hid_details_costPrice‎s").val());//安装费总价
    var discount = parseFloat($("#hid_Discount").val());//折扣金额 
    
    var incrdmentTax=parseFloat($("#hid_IncrdmentTax").val());//增值税税率Z
    var salesTax=parseFloat($("#hid_SalesTax‎‎").val());//营业税Y
    var additionalTax=parseFloat($("#hid_AdditionalTax").val());//附加税F 
    
    //安装费附加税=安装费总价 * Y * F/(1+Y)
    //var anZhuangAdditionalTax = installFee*salesTax*additionalTax/(1+additionalTax);//安装费附加税AZ
    
    /*利益率 = ( (软硬件总售价 - 软硬件总成本价)/(1+Z) + 安装费总价/(1+Y) 
     *          - (软硬件总售价 -　软硬件总成本价) * Z * F - 折扣金额 -安装费附加税AZ )
     *          /(软硬件总售价/(1+Z) +　安装费总价/(1+Y))
     *
     */
    //    var profitRate = ((totaldetailTotalIncTax - totalCostPrice) / (1+incrdmentTax) + installFee / (1 + salesTax)
    //        - (totaldetailTotalIncTax -totalCostPrice) * incrdmentTax * additionalTax - discount-anZhuangAdditionalTax)
    //    / (totaldetailTotalIncTax / (1 + incrdmentTax) + installFee / (1 + salesTax));  

    //(L1-B1-M1-N1-O1)/L1
    var L1 = totaldetailTotalIncTax / (1 + incrdmentTax) + installFee / (1 + salesTax);//软件硬件总价/(1+Z)+安装费(1+Y)
    var B1 = totalCostPrice/(1+incrdmentTax);//软硬件总成本价/(1+Z)
    var M1= (installFee-installFee/(1+salesTax))*additionalTax;//(安装费总价-安装费总价/(1+y))*F
    //var N1 = (totaldetailTotalIncTax-totalCostPrice)*additionalTax;//(软件硬件总价-软硬件总成本价)*F
    var N1= (totaldetailTotalIncTax -totalCostPrice)*incrdmentTax*additionalTax/(1+incrdmentTax);//((销售总价/(1+z))*F-(销售成本价/(1+z))*F)*F
    var O1 = discount;//折扣价 
    
    var profitRate = (L1-B1-M1-N1-O1)/L1;
    
    $("#labProfitability").text((profitRate*100).toFixed(2)+'%');// 利益率文本赋值
    $("#hid_ProfitRate‎").val(profitRate);//实际利益率
} 

//计算软硬件实际成本总价
function calculateCostPrice(){ 
    var totalCostPrice =0;//参考成本价总和   
    $("#selectedProductsTable tr").find("input[valueType='hidcostPrice']").each(function(i){
        var tr = $(this).parent().parent();
        var pid = tr.find("input[valueType='pid']").val(); 
        if(pid){
            //alert(pid+"="+$("#hid_an_zhuang_fei_id").val())
            if( pid != $("#hid_an_zhuang_fei_id").val()){
                var number = parseInt(tr.children("td:eq(3)").html());//数量 
                var costPrice =parseFloat(tr.find("input[valueType='costPrice']").val());//实际成本价 
                
                totalCostPrice += number*costPrice;   
            }  
        } 
    });   
    //实际成本总价
    $("#hid_costPrice").val(totalCostPrice);
}

//计算成本价
function calculateTotalCostPrice(txtNumber){
    var tr = $(txtNumber).parent().parent();
    var costPrice =parseFloat($(txtNumber).val());    
    var hidCostPrice = tr.find("input[valueType='hidcostPrice']");//隐藏的实际成本价
    var stdCostPrice = parseFloat(tr.find("input[valueType='stdCostPrice']").val());//参考成本价
     
    if(costPrice){
        if(costPrice<=0){
            alert("请输入合法的实际成本价");
            $(txtNumber).val(hidCostPrice.val());
            return;
        }else{
            if(costPrice>stdCostPrice){  
                alert("实际成本价【"+costPrice+"】必须小于等于参考成本价【"+stdCostPrice+"】");
                $(txtNumber).val(hidCostPrice.val());
            }
            else
            { 
                hidCostPrice.val(costPrice);
                //计算实际成本总价
                calculateCostPrice(); 
                //计算利益率
                calculateprofitability();    
            }
        }
        
    }else{
        alert("请输入合法的实际成本价");
        $(txtNumber).val(hidCostPrice.val());
        return;
    } 
} 

//订单赋值并验证数据
function setOrderValueAndValid(){  
    var msg = '';
    var ids='';//订单明细IDs     
    var costprices='';//订单明细实际成本价 
    var anZhuangFeiId = $("#hid_an_zhuang_fei_id").val();//安装费产品ID 
    var suppliersIds = '';//供应商IDs
    var productIndex = 1;//产品行号
    $("#selectedProductsTable tr").each(function(i){  
        var productId = $(this).find("input[valueType='pid']").val(); //产品ID 
        var id = $(this).find("input[valueType='id']").val(); //订单明细ID
        var costprice = parseFloat($(this).find("input[valueType='hidcostPrice']").val());//参考成本价 
         
        if(productId && id && costprice)
        { 
            if(productId==anZhuangFeiId){
                suppliersIds +='0|';
            }
            else
            {
                var suppliersId = $(this).find("select[id='dropSupplier']").val(); 
                if(suppliersId=='0'){ 
                    msg= "请为第【"+productIndex+"】个产品【型号："+$(this).children('td:eq(0)').html()+"】选择供应商";
                }
                else{
                    suppliersIds += suppliersId+'|';
                }
            }
            costprices += costprice+'|';
            ids += id+'|';  
            productIndex++;
        }  
    }); 
    
    if(msg != ''){
        return msg;
    }
    
    $("#hid_costPrices").val(costprices);//赋值实际成本明细价，以|隔开
    $("#hid_suppliers").val(suppliersIds);//赋值供应商明细id，以|隔开
    $("#hid_ids").val(ids);  //赋值订单明细ID，以|隔开
    
    var minProfitRate = parseFloat($("#hid_MinProfitRate‎").val());//最小利益率
    var profitability =  parseFloat($("#hid_ProfitRate‎").val());//当前利益率
    if(minProfitRate>profitability){
        var profitabilityText = profitability.toFixed(4)*100;
        var minProfitRateText = minProfitRate.toFixed(4)*100;
        return "不能生成报价单：当前利益率【"+profitabilityText+"%】<最低利益率【"+minProfitRateText+"%】";
    }    
    else{
        return '';
    } 
}

