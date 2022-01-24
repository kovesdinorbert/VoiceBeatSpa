
DECLARE @systemId nvarchar(max)
DECLARE @huId nvarchar(max)
DECLARE @enId nvarchar(max)
DECLARE @currentText nvarchar(max)
SET @systemId = (SELECT Id From Users where email='kovnor@vipmail.hu')
SET @huId = (SELECT Id From Languages where Code='hu')
SET @enId = (SELECT Id From Languages where Code='en')

------ServicesRent = 25,
SET @currentText = NEWID();

INSERT INTO [dbo].[LivingTexts]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LivingTextType],[IsHtmlEncoded])
     VALUES
           (@currentText,GETDATE(),@systemId,null,null,1,25,1)

INSERT INTO [dbo].[Translations]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LanguageId],[LivingTextId],[Text],[Subject])
     VALUES
		   (NEWID(),GETDATE(),@systemId,null,null,1,@huId,@currentText, N'', N'')
		   
INSERT INTO [dbo].[Translations]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LanguageId],[LivingTextId],[Text],[Subject])
       VALUES 
		   (NEWID(),GETDATE(),@systemId,null,null,1,@enId,@currentText, N'', N'')

------ServicesRooms = 26,
SET @currentText = NEWID();

INSERT INTO [dbo].[LivingTexts]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LivingTextType],[IsHtmlEncoded])
     VALUES
           (@currentText,GETDATE(),@systemId,null,null,1,26,1)

INSERT INTO [dbo].[Translations]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LanguageId],[LivingTextId],[Text],[Subject])
     VALUES
		   (NEWID(),GETDATE(),@systemId,null,null,1,@huId,@currentText, N'', N'')
		   
INSERT INTO [dbo].[Translations]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LanguageId],[LivingTextId],[Text],[Subject])
       VALUES 
		   (NEWID(),GETDATE(),@systemId,null,null,1,@enId,@currentText, N'', N'')

------ServicesEvents = 27,
SET @currentText = NEWID();

INSERT INTO [dbo].[LivingTexts]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LivingTextType],[IsHtmlEncoded])
     VALUES
           (@currentText,GETDATE(),@systemId,null,null,1,27,1)

INSERT INTO [dbo].[Translations]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LanguageId],[LivingTextId],[Text],[Subject])
     VALUES
		   (NEWID(),GETDATE(),@systemId,null,null,1,@huId,@currentText, N'', N'')
		   
INSERT INTO [dbo].[Translations]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LanguageId],[LivingTextId],[Text],[Subject])
       VALUES 
		   (NEWID(),GETDATE(),@systemId,null,null,1,@enId,@currentText, N'', N'')

------ServicesStudio = 28,
SET @currentText = NEWID();

INSERT INTO [dbo].[LivingTexts]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LivingTextType],[IsHtmlEncoded])
     VALUES
           (@currentText,GETDATE(),@systemId,null,null,1,28,1)

INSERT INTO [dbo].[Translations]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LanguageId],[LivingTextId],[Text],[Subject])
     VALUES
		   (NEWID(),GETDATE(),@systemId,null,null,1,@huId,@currentText, N'', N'')
		   
INSERT INTO [dbo].[Translations]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LanguageId],[LivingTextId],[Text],[Subject])
       VALUES 
		   (NEWID(),GETDATE(),@systemId,null,null,1,@enId,@currentText, N'', N'')
