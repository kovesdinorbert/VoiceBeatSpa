DELETE FROM [dbo].[UserRole]
DELETE FROM [dbo].[Roles]
DELETE FROM [dbo].[Users] WHERE [dbo].[Users].[Email] != 'system'

INSERT INTO [dbo].[Roles]
           ([Id]
           ,[Name])
     VALUES
           (NEWID()
           ,'Admin')

INSERT INTO [dbo].[Roles]
           ([Id]
           ,[Name])
     VALUES
           (NEWID()
           ,'User')

INSERT INTO [dbo].[Users]
           ([Id]
           ,[Created]
           ,[CreatedBy]
           ,[Modified]
           ,[ModifiedBy]
           ,[IsActive]
           ,[Email]
           ,[Password]
           ,[Salt]
           ,[ChangePassword]
           ,[LastLogin]
           ,[LastWrongPassword]
           ,[WrongPasswordCount]
           ,[PhoneNumber]
           ,[Newsletter]
           ,[ReservationRuleAccepted]
           ,[Token])
     VALUES
           (NEWID()
           ,GETDATE()
           ,(SELECT TOP 1 Id FROM Users where Users.Email = 'system')
           ,null
           ,null
           ,1
           ,'kovnor@vipmail.hu'
           ,'71CBFBCE058F3155DD451B6B3BFCC7A5E33FA4379715670749BCA83799988784'
           ,'pd7tusdx57uks4o5'
           ,0
           ,null
           ,null
           ,0
           ,'06301111111'
           ,0
           ,0
           ,'')
		   
INSERT INTO [dbo].[UserRole]
           ([UserId]
           ,[RoleId])
     VALUES
           ((SELECT TOP 1 Id FROM [dbo].[Users] where [dbo].[Users].[Email] = 'kovnor@vipmail.hu')
           ,(SELECT TOP 1 Id FROM [dbo].[Roles] where [dbo].[Roles].[Name] = 'Admin'))
