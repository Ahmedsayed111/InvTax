 
select 0 as [InvoiceID],it.ItemID as [ItemID],UM.UomID as [UomID],0 as [InvoiceSoldQty],efD.Qty as  [SoldQty],efD.Price as [Unitprice],
 0 as [DiscountPrc],0 as [DiscountAmount], (efD.Qty * efD.Price) as [NetUnitPrice],0 as [VatPrc],0 as [VatAmount],
 0 as [StockSoldQty],0 as [StockUnitCost],0 as [VatApplied],0 as[TotRetQty],0 as [Serial],0 as [AllowAmount],0 as [AllowancePrc]
 ,0 as [AllowanceBase],'' as [AllowReason],0 as [AllowCode],0 as [BaseQty],0 as [BaseQtyUomid],0 as [BaseQtyPrice],0 as [BaseQtyDiscount],
 0 as [DiscountPrcBase],0 as [DiscountVatNatID],'' as [Discountreason],0 as [DiscountCode],0 as [ItemNetAmount],0 as [ChargeAmount],
 0 as [ChargePrc],0 as [ChargeBase],0 as [ChargeVatNatID],0 as [ChargeVatPrc],0 as [ChargeAfterVat],'' as[ChargeReason],0 as [ChargeCode]
 , 0as [VatNatID],0 as [UnitpriceWithVat],0 as [NetUnitPriceWithVat],it.description as  [Itemdesc]   ,0 as [TaxID],UM.UomID as [unitValueID] 
FROM OPENROWSET('Microsoft.ACE.OLEDB.12.0','Excel 12.0; HDR=YES;Database=F:\ExellTemp\Test.xlsx',[Sheet1$]) efD  inner join 
Items it on efD.ItemCode collate Arabic_CI_AS =  it.itemCode inner join I_D_UOM UM on it.UnitCode = UM.UomID   



select * from [dbo].[Sls_Ivoice]  where RefNO in ( select InvoiceNo
FROM OPENROWSET('Microsoft.ACE.OLEDB.12.0','Excel 12.0; HDR=YES;Database=F:\ExellTemp\Test.xlsx',[Sheet1$]) efD  inner join  
(select * FROM OPENROWSET('Microsoft.ACE.OLEDB.12.0','Excel 12.0; HDR=YES;Database=F:\ExellTemp\Test.xlsx',[Sheet1$]) )ef
on efD.InvoiceNo = ef.InvoiceNo)
Items it on efD.ItemCode collate Arabic_CI_AS =  it.itemCode inner join I_D_UOM UM on it.UnitCode = UM.UomID  ) 
and InvoiceID >= 3023 and InvoiceID <= 3026   


select *
FROM OPENROWSET('Microsoft.ACE.OLEDB.12.0','Excel 12.0; HDR=YES;Database=F:\ExellTemp\Test.xlsx',[Sheet1$]) efD inner join
(select * FROM OPENROWSET('Microsoft.ACE.OLEDB.12.0','Excel 12.0; HDR=YES;Database=F:\ExellTemp\Testmaster.xlsx',[Sheet1$]) ) ef 
on ef.InvoiceNo = efD.InvoiceNo


select * from [dbo].[Sls_Ivoice]  where RefNO in (
select ef.InvoiceNo
FROM OPENROWSET('Microsoft.ACE.OLEDB.12.0','Excel 12.0; HDR=YES;Database=F:\ExellTemp\Test.xlsx',[Sheet1$]) efD inner join
(select * FROM OPENROWSET('Microsoft.ACE.OLEDB.12.0','Excel 12.0; HDR=YES;Database=F:\ExellTemp\Testmaster.xlsx',[Sheet1$]) ) ef 
on ef.InvoiceNo = efD.InvoiceNo
group by ef.InvoiceNo
) and InvoiceID >= 3023 and InvoiceID <= 3026  and InvoiceID not in (select InvoiceID from [dbo].Sls_InvoiceDetail )





DECLARE @After_LastID int
DECLARE @After_LastIDNew int 
DECLARE @befor_LastID int
DECLARE @InvoiceID int
DECLARE @RefNO int
DECLARE @Cnt int
 
 set @After_LastIDNew = 3023
 set @After_LastID = 3023
 set @befor_LastID = 3026
 set @Cnt  = 1;

WHILE ( @After_LastIDNew <= @befor_LastID)
BEGIN 
 
  
  select @InvoiceID = InvoiceID , @RefNO = RefNO from (
select ROW_NUMBER() OVER( order by InvoiceID) AS Num_Row ,InvoiceID ,  RefNO from [dbo].[Sls_Ivoice]  where RefNO in (
select ef.InvoiceNo
FROM OPENROWSET('Microsoft.ACE.OLEDB.12.0','Excel 12.0; HDR=YES;Database=F:\ExellTemp\Test.xlsx',[Sheet1$]) efD inner join
(select * FROM OPENROWSET('Microsoft.ACE.OLEDB.12.0','Excel 12.0; HDR=YES;Database=F:\ExellTemp\Testmaster.xlsx',[Sheet1$]) ) ef 
on ef.InvoiceNo = efD.InvoiceNo
group by ef.InvoiceNo
) and InvoiceID >= @After_LastID and InvoiceID <= @befor_LastID  and InvoiceID not in (select InvoiceID from [dbo].Sls_InvoiceDetail )
 )t1 where Num_Row = @Cnt



 insert into [dbo].[Sls_InvoiceDetail]
select @InvoiceID as [InvoiceID],it.ItemID as [ItemID],UM.UomID as [UomID],0 as [InvoiceSoldQty],efD.Qty as  [SoldQty],efD.Price as [Unitprice],
 0 as [DiscountPrc],0 as [DiscountAmount], (efD.Qty * efD.Price) as [NetUnitPrice],0 as [VatPrc],0 as [VatAmount],
 0 as [StockSoldQty],0 as [StockUnitCost],0 as [VatApplied],0 as[TotRetQty],0 as [Serial],0 as [AllowAmount],0 as [AllowancePrc]
 ,0 as [AllowanceBase],'' as [AllowReason],0 as [AllowCode],0 as [BaseQty],0 as [BaseQtyUomid],0 as [BaseQtyPrice],0 as [BaseQtyDiscount],
 0 as [DiscountPrcBase],0 as [DiscountVatNatID],'' as [Discountreason],0 as [DiscountCode],0 as [ItemNetAmount],0 as [ChargeAmount],
 0 as [ChargePrc],0 as [ChargeBase],0 as [ChargeVatNatID],0 as [ChargeVatPrc],0 as [ChargeAfterVat],'' as[ChargeReason],0 as [ChargeCode]
 , 0as [VatNatID],0 as [UnitpriceWithVat],0 as [NetUnitPriceWithVat],it.description as  [Itemdesc]   ,0 as [TaxID],UM.UomID as [unitValueID] 
FROM OPENROWSET('Microsoft.ACE.OLEDB.12.0','Excel 12.0; HDR=YES;Database=F:\ExellTemp\Test.xlsx',[Sheet1$]) efD  inner join 
Items it on efD.ItemCode collate Arabic_CI_AS =  it.itemCode inner join I_D_UOM UM on it.UnitCode = UM.UomID  where efD.InvoiceNo = @RefNO





    SET @Cnt  = @Cnt  + 1
	SET @After_LastIDNew  = @After_LastIDNew  + 1
END






Select InvoiceID from (select  ROW_NUMBER() OVER( order by InvoiceID) AS Num_Row ,InvoiceID from Sls_Ivoice )t1 where Num_Row = 1





 select    InvoiceID ,    RefNO from (
select ROW_NUMBER() OVER( order by InvoiceID) AS Num_Row ,InvoiceID ,  RefNO from [dbo].[Sls_Ivoice]  where RefNO in (
select ef.InvoiceNo
FROM OPENROWSET('Microsoft.ACE.OLEDB.12.0','Excel 12.0; HDR=YES;Database=F:\ExellTemp\Test.xlsx',[Sheet1$]) efD inner join
(select * FROM OPENROWSET('Microsoft.ACE.OLEDB.12.0','Excel 12.0; HDR=YES;Database=F:\ExellTemp\Testmaster.xlsx',[Sheet1$]) ) ef 
on ef.InvoiceNo = efD.InvoiceNo
group by ef.InvoiceNo
) and InvoiceID >= 3046 and InvoiceID <= 3049   and ChargeCode  in (0)
 )t1 



 select ROW_NUMBER() OVER( order by InvoiceID) AS Num_Row ,InvoiceID ,  RefNO, ChargeCode from [dbo].[Sls_Ivoice]  where RefNO in (
select *
FROM OPENROWSET('Microsoft.ACE.OLEDB.12.0','Excel 12.0; HDR=YES;Database=F:\ExellTemp\Test.xlsx',[Sheet1$]) efD  
group by efD.InvoiceNo,efD.ItemCode
) and InvoiceID >= 3046 and InvoiceID <= 3049 


select InvoiceID from [dbo].Sls_InvoiceDetail  where ChargeCode = 0


       DECLARE @TrNo int
       DECLARE @dt smalldatetime

			SELECT  @TrNo =TrNo , @dt= TrDate , from I_Sls_TR_Invoice WHERE InvoiceID= @TrID 
			
    
			 EXECUTE @R = [dbo].[G_TOL_GetCounter]  'I' ,@Comp  ,@Branch ,@dt ,@TrType ,@TrNo OUTPUT	