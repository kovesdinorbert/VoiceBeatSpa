
DECLARE @systemId nvarchar(max)
DECLARE @huId nvarchar(max)
DECLARE @enId nvarchar(max)
DECLARE @currentText nvarchar(max)
SET @systemId = (SELECT Id From Users where email='system')
SET @huId = (SELECT Id From Languages where Code='hu')
SET @enId = (SELECT Id From Languages where Code='en')

------EmailReservationSent = 0,
SET @currentText = NEWID();

INSERT INTO [dbo].[LivingTexts]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LivingTextType],[IsHtmlEncoded])
     VALUES
           (@currentText,GETDATE(),@systemId,null,null,1,0,1)

INSERT INTO [dbo].[Translations]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LanguageId],[LivingTextId],[Text],[Subject])
     VALUES
           (NEWID(),GETDATE(),@systemId,null,null,1,@huId,@currentText,'hu szoveg','hu subject')

INSERT INTO [dbo].[Translations]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LanguageId],[LivingTextId],[Text],[Subject])
     VALUES
           (NEWID(),GETDATE(),@systemId,null,null,1,@enId,@currentText,'en szoveg','en subject')


------EmailRegistration = 1,
SET @currentText = NEWID();

INSERT INTO [dbo].[LivingTexts]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LivingTextType],[IsHtmlEncoded])
     VALUES
           (@currentText,GETDATE(),@systemId,null,null,1,1,1)

INSERT INTO [dbo].[Translations]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LanguageId],[LivingTextId],[Text],[Subject])
     VALUES
           (NEWID(),GETDATE(),@systemId,null,null,1,@huId,@currentText,'hu EmailRegistration szoveg','hu subject')

INSERT INTO [dbo].[Translations]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LanguageId],[LivingTextId],[Text],[Subject])
     VALUES
           (NEWID(),GETDATE(),@systemId,null,null,1,@enId,@currentText,'en EmailRegistration szoveg','en subject')
		   

------EmailForgottenPassword = 2,
SET @currentText = NEWID();

INSERT INTO [dbo].[LivingTexts]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LivingTextType],[IsHtmlEncoded])
     VALUES
           (@currentText,GETDATE(),@systemId,null,null,1,2,1)

INSERT INTO [dbo].[Translations]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LanguageId],[LivingTextId],[Text],[Subject])
     VALUES
           (NEWID(),GETDATE(),@systemId,null,null,1,@huId,@currentText,'hu EmailForgottenPassword szoveg','hu subject')

INSERT INTO [dbo].[Translations]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LanguageId],[LivingTextId],[Text],[Subject])
     VALUES
           (NEWID(),GETDATE(),@systemId,null,null,1,@enId,@currentText,'en EmailForgottenPassword szoveg','en subject')
		   

------StartPageText = 3,
SET @currentText = NEWID();

INSERT INTO [dbo].[LivingTexts]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LivingTextType],[IsHtmlEncoded])
     VALUES
           (@currentText,GETDATE(),@systemId,null,null,1,3,1)

INSERT INTO [dbo].[Translations]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LanguageId],[LivingTextId],[Text],[Subject])
     VALUES
           (NEWID(),GETDATE(),@systemId,null,null,1,@huId,@currentText,'<p style="text-align: justify;">Igényesen felszerelt, modern helyszínünket 2018 januárjában nyitottuk meg. Három tágas próbateremmel és egy hang stúdióval várjuk a minőségi helyszínt kereső bandákat. A cigifüstmentes előtérben, a későbbiekben ital -, kávé - és snackautomaták mellett egy klasszikus zongora is segít a lazulásban, a fedett teraszon pedig a dohányosok élvezhetik a próbák szüneteit, ingyenes Wi-Fi használat mellett. Tágas termeinket télen fűtjük, nyáron hűtjük, így mindenki kényelmes és otthonos hangulatban írhatja és próbálhatja nótáit.</p><p>Már 12 éve foglalkozunk próbaterem üzemeltetéssel (Fregath Music), érdeklődésünk fókuszában is a zene szerepel. Ez évek alatt sok zenei tapasztalatot szereztünk.</p><p>Fontosnak tartjuk a kisebb és feltörekvő, tehetséges underground zenekarok előre jutását, mely többek között diákprogramunk segítségével 50% kedvezményt foglal magában. Menedzseri és fellépési lehetőséget is tudunk biztosítani zenekaraink részére.</p><p>Hangstúdiónkban külön van lehetőség éneket,  dobot,  gitárt,  szintetizátort  illetve  bármilyen zenei  eszközt  sávonként  felvenni,  vagy egyben  az  összes  hangszert  is. Természetesen dalaitokat keverni is tudjuk. :D</p><p>Részletekért érdeklődjetek telefonon, e-mailen vagy akár Facebookon is.</p><p>Sok szeretettel várunk mindenkit!</p>','')

INSERT INTO [dbo].[Translations]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LanguageId],[LivingTextId],[Text],[Subject])
     VALUES
           (NEWID(),GETDATE(),@systemId,null,null,1,@enId,@currentText,'<p>We opened our well-equipped, modern location in January 2018. With three spacious rehearsal rooms and a sound studio, we are waiting for bands looking for a quality venue. In addition to the smoking, coffee and snack vending machines in the non - smoking lobby, a classic piano will help you relax, and on the covered terrace, smokers can enjoy a break with free Wi - Fi. Our spacious rooms are heated in winter and cooled in summer, so everyone can write and try their songs in a comfortable and homely atmosphere.</p><p>We have been operating a rehearsal room (Fregath Music) for 12 years, our focus is also on music. We have gained a lot of musical experience over the years.</p><p>We consider it important to advance smaller and emerging, talented underground bands, which includes a 50% discount with the help of our student program, among other things. We can also provide managerial and performance opportunities for our bands.</p><p>In our sound studio it is possible to record songs, drums, guitars, synthesizers and any musical instrument separately, or all the instruments at the same time. Of course we can also mix your songs. : D</p><p>Ask for details by phone, email or even Facebook.</p><p>We look forward to seeing you all!</p>', '')
		   

------PricesText = 4,
SET @currentText = NEWID();

INSERT INTO [dbo].[LivingTexts]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LivingTextType],[IsHtmlEncoded])
     VALUES
           (@currentText,GETDATE(),@systemId,null,null,1,4,1)

INSERT INTO [dbo].[Translations]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LanguageId],[LivingTextId],[Text],[Subject])
     VALUES
           (NEWID(),GETDATE(),@systemId,null,null,1,@huId,@currentText,'<h3>Áraink:</h3>','')

INSERT INTO [dbo].[Translations]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LanguageId],[LivingTextId],[Text],[Subject])
     VALUES
           (NEWID(),GETDATE(),@systemId,null,null,1,@enId,@currentText,'<h3>Our prices :</h3>','')
		   

------DiscountsText = 5,
SET @currentText = NEWID();

INSERT INTO [dbo].[LivingTexts]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LivingTextType],[IsHtmlEncoded])
     VALUES
           (@currentText,GETDATE(),@systemId,null,null,1,5,1)

INSERT INTO [dbo].[Translations]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LanguageId],[LivingTextId],[Text],[Subject])
     VALUES
           (NEWID(),GETDATE(),@systemId,null,null,1,@huId,@currentText,'<h3>Kedvezmények:</h3><p><br></p><p>Ha diákigazolvánnyal rendelkezel 50% kedvezményt kapsz a próba rád eso részébol!</p><p><br></p><p>A diákkedvezmény,csak a kék teremre vonatkozik minden nap 17:00-ig!</p><p><br></p><p><br></p><p>Minden rendszeresen próbáló vendégeink részére (legalább</p><p>heti egy), törzs kártyát adunk, amivel minden 10. óra ingyenes!</p><p><br></p><p>A törzskártya érvényes 2020.01.01-visszavonásig!</p><p><br></p><p><br></p><p>(A kedvezmények nem összevonhatók!)</p>','')

INSERT INTO [dbo].[Translations]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LanguageId],[LivingTextId],[Text],[Subject])
     VALUES
           (NEWID(),GETDATE(),@systemId,null,null,1,@enId,@currentText,'<h3>Discounts:</h3><p><br> </p><p> If you have a student ID card, you will get a 50% discount on your part of the rehearsal! </p><p><br> </p><p>The student discount only applies to the blue room until 17:00 every day!</p><p><br> </p><p><br> </p><p> For all our regular guests (at least </p><p> one weekly), we give you a loyalty card, which is free every 10 hours! </p><p><br> </p><p> The loyalty card is valid until 01.01.2020 revocation! </p><p><br> </p><p><br> </p><p> (Discounts cannot be combined!) </p>','')
		   

------ReservationRulesText = 6,
SET @currentText = NEWID();

INSERT INTO [dbo].[LivingTexts]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LivingTextType],[IsHtmlEncoded])
     VALUES
           (@currentText,GETDATE(),@systemId,null,null,1,6,1)

INSERT INTO [dbo].[Translations]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LanguageId],[LivingTextId],[Text],[Subject])
     VALUES
           (NEWID(),GETDATE(),@systemId,null,null,1,@huId,@currentText,'<p style="box-sizing: border-box; margin: 0px 0px 25px; position: relative; font-family: Arial; font-size: 18px; font-weight: 400; line-height: 1.5; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;">Próbatermünkbe több módon tudsz idopontot foglalni.<br style="box-sizing: border-box; position: relative;"><br style="box-sizing: border-box; position: relative;">Telefon: A 0630-710-0661 telefonszámon (10:00 - 22:00ig)<br style="box-sizing: border-box; position: relative;"><br style="box-sizing: border-box; position: relative;">E-mail: voicebeat.bt@gmail.com<br style="box-sizing: border-box; position: relative;"><br style="box-sizing: border-box; position: relative;">Facebook:<span>&nbsp;</span><a href="https://www.facebook.com/voicebeatobuda/" style="box-sizing: border-box; background-color: transparent; text-decoration: none; position: relative;">https://www.facebook.com/voicebeatobuda/</a><br style="box-sizing: border-box; position: relative;"><br style="box-sizing: border-box; position: relative;">Online:<span>&nbsp;</span><strong>Az online foglalás csak<span>&nbsp;</span><a href="https://www.voicebeat.hu/Home/Register" style="box-sizing: border-box; background-color: transparent; text-decoration: none; position: relative;">regisztrált</a><span>&nbsp;</span>felhasználók számára érheto el!</strong>.<br style="box-sizing: border-box; position: relative;"></p><h4 style="box-sizing: border-box; font-family: &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; font-weight: 500; line-height: 1.1; margin-top: 10px; margin-bottom: 10px; font-size: 25px; position: relative; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;">Stúdió foglalás</h4><p><span style="font-family: &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">Stúdió foglalásra csak telefonon van lehetoség.</span></p><p><br style="box-sizing: border-box; position: relative; font-family: &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;"></p><p><br style="box-sizing: border-box; position: relative; font-family: &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;"></p><h4 style="box-sizing: border-box; font-family: &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; font-weight: 500; line-height: 1.1; margin-top: 10px; margin-bottom: 10px; font-size: 25px; position: relative; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;">Az online foglalás menete</h4><ul style="box-sizing: border-box; margin-top: 0px; margin-bottom: 10px; position: relative; font-family: &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;"><li style="box-sizing: border-box; position: relative;"><a href="https://www.voicebeat.hu/Home/Login" style="box-sizing: border-box; background-color: transparent; text-decoration: none; position: relative;"><strong>Bejelentkezés</strong></a></li><li style="box-sizing: border-box; position: relative;">Teremfoglalás menüpont</li><li style="box-sizing: border-box; position: relative;">Elso alkalommal: felhasználási feltételek elfogadása</li><li style="box-sizing: border-box; position: relative;">A naptár segítségével a megfelelo nap kiválasztása</li><li style="box-sizing: border-box; position: relative;">A kiválasztott terem alatt a kívánt idopont cellájára kattintás és lenyomva tartás (mobil eszközön hosszabb ideig kell nyomva tartani)</li><li style="box-sizing: border-box; position: relative;">Lefelé húzás a kívánt idopont végéig és elengedés</li><li style="box-sizing: border-box; position: relative;">A felugró ablakban a kiválasztott idopont ellenorzése</li><li style="box-sizing: border-box; position: relative;">OK gombbal idopont lefoglalása/Mégse gombbal javítás</li><li style="box-sizing: border-box; position: relative;">E-mail címre kiküldött levél ellenorzése<span>&nbsp;</span><strong>(csak az emailben visszaigazolt foglalás tekintheto érvényesnek!)</strong></li></ul><p><br style="box-sizing: border-box; position: relative; font-family: &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;"></p><h4 style="box-sizing: border-box; font-family: &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; font-weight: 500; line-height: 1.1; margin-top: 10px; margin-bottom: 10px; font-size: 25px; position: relative; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;">Az online foglalás felhasználási feltételei</h4><ul style="box-sizing: border-box; margin-top: 0px; margin-bottom: 10px; position: relative; font-family: &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;"><li style="box-sizing: border-box; position: relative;">Csak regisztrált felhasználónak</li><li style="box-sizing: border-box; position: relative;">Online foglalás esetén idopontodat 48 órával a próba elott törölheted, 2 napon belül pedig erre csak telefonon van lehetoséged</li><li style="box-sizing: border-box; position: relative;">12 órán belüli próba lemondás esetén a lemondott órák felét felszámítjuk,melynek rendezése a következo alkalomnál esedékes!</li><li style="box-sizing: border-box; position: relative;">Regisztrációdat bármikor törölheted, ha nincs aktív online foglalásod, ha van, akkor csak telefonos egyeztetés után tudod törölni a profilodat</li></ul><p><br style="box-sizing: border-box; position: relative; font-family: &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;"></p><p><br style="box-sizing: border-box; position: relative; font-family: &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;"></p><p><span style="font-family: &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">Kérdés esetén fordulj hozzánk bizalommal,</span></p><p><br style="box-sizing: border-box; position: relative; font-family: &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;"></p><p><strong>Voice - Beat Csapata</strong></p>','')

INSERT INTO [dbo].[Translations]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LanguageId],[LivingTextId],[Text],[Subject])
     VALUES
           (NEWID(),GETDATE(),@systemId,null,null,1,@enId,@currentText,'<p style="box-sizing: border-box; margin: 0px 0px 25px; position: relative; line-height: 1.5; orphans: 2; text-align: start; text-indent: 0px; widows: 2; text-decoration-style: initial; text-decoration-color: initial;"><font face="Arial"><span style="font-size: 18px; letter-spacing: normal;">There are several ways to book an appointment in our rehearsal room.</span></font><br style="box-sizing: border-box; position: relative;"><br style="box-sizing: border-box; position: relative;"><font face="Arial"><span style="font-size: 18px; letter-spacing: normal;">Phone: On 0630-710-0661 (10:00 - 22:00)</span></font><br style="box-sizing: border-box; position: relative;"><br style="box-sizing: border-box; position: relative;"><font face="Arial"><span style="font-size: 18px; letter-spacing: normal;">Email: voicebeat.bt@gmail.com</span></font><br style="box-sizing: border-box; position: relative;"><br style="box-sizing: border-box; position: relative;"><font face="Arial"><span style="font-size: 18px; letter-spacing: normal;">Facebook: https://www.facebook.com/voicebeatobuda/</span></font><br style="box-sizing: border-box; position: relative;"><br style="box-sizing: border-box; position: relative;"><span style="font-size: 18px; letter-spacing: normal;">Online: </span><strong><span style="font-size: 18px; letter-spacing: normal;">Online booking is only available to registered users !</span></strong><span style="font-size: 18px; letter-spacing: normal;">.</span><br></p><h4 style="box-sizing: border-box; font-family: &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; font-weight: 500; line-height: 1.1; margin-top: 10px; margin-bottom: 10px; font-size: 25px; position: relative; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;">Studio reservation</h4><p><span style="font-family: &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">Studio bookings are only possible by telephone.</span></p><p><br></p><h4 style="box-sizing: border-box; font-family: &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; font-weight: 500; line-height: 1.1; margin-top: 10px; margin-bottom: 10px; font-size: 25px; position: relative; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;">How to book online</h4><ul style="box-sizing: border-box; margin-top: 0px; margin-bottom: 10px; position: relative; orphans: 2; text-align: start; text-indent: 0px; widows: 2; text-decoration-style: initial; text-decoration-color: initial;"><li style="font-family: &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; text-transform: none; white-space: normal; word-spacing: 0px; -webkit-text-stroke-width: 0px; box-sizing: border-box; position: relative;"><a href="https://www.voicebeat.hu/Home/Login" style="box-sizing: border-box; background-color: transparent; text-decoration: none; position: relative;" target="">Login</a></li><li style="box-sizing: border-box; position: relative;"><font face="Helvetica Neue, Helvetica, Arial, sans-serif"><span style="font-size: 14px; letter-spacing: normal;">Room reservation menu item</span></font><br></li><li style="font-family: &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; text-transform: none; white-space: normal; word-spacing: 0px; -webkit-text-stroke-width: 0px; box-sizing: border-box; position: relative;">For the first time: acceptance of terms of use</li><li style="font-family: &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; text-transform: none; white-space: normal; word-spacing: 0px; -webkit-text-stroke-width: 0px; box-sizing: border-box; position: relative;">Use the calendar to select the appropriate day</li><li style="font-family: &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; text-transform: none; white-space: normal; word-spacing: 0px; -webkit-text-stroke-width: 0px; box-sizing: border-box; position: relative;">Click and hold on the cell of the desired time during the selected room (press and hold on a mobile device for a long time)</li><li style="font-family: &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; text-transform: none; white-space: normal; word-spacing: 0px; -webkit-text-stroke-width: 0px; box-sizing: border-box; position: relative;">Drag down to the end of the desired time and release</li><li style="font-family: &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; text-transform: none; white-space: normal; word-spacing: 0px; -webkit-text-stroke-width: 0px; box-sizing: border-box; position: relative;">Check the selected time in the pop-up window</li><li style="font-family: &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; text-transform: none; white-space: normal; word-spacing: 0px; -webkit-text-stroke-width: 0px; box-sizing: border-box; position: relative;">Press OK to book an appointment / Cancel to correct</li><li style="box-sizing: border-box; position: relative;"><font face="Helvetica Neue, Helvetica, Arial, sans-serif"><span style="font-size: 14px; letter-spacing: normal;">Verification of the letter sent to the e-mail address </span></font><strong><font face="Helvetica Neue, Helvetica, Arial, sans-serif"><span style="font-size: 14px; letter-spacing: normal;">(only the reservation confirmed by e-mail can be considered valid!)</span></font></strong><br></li></ul><p><br style="box-sizing: border-box; position: relative; font-family: &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;"></p><h4 style="box-sizing: border-box; font-family: &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; font-weight: 500; line-height: 1.1; margin-top: 10px; margin-bottom: 10px; font-size: 25px; position: relative; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;">Terms of use for online booking</h4><ul style="box-sizing: border-box; margin-top: 0px; margin-bottom: 10px; position: relative; font-family: &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;"><li style="box-sizing: border-box; position: relative;">For registered users only</li><li style="box-sizing: border-box; position: relative;">If you book online, you can cancel your appointment 48 hours before the trial, and within 2 days you can only do so by phone.</li><li style="box-sizing: border-box; position: relative;">In case of a trial cancellation within 12 hours, we will charge half of the canceled hours, the settlement of which is due the next time!</li><li style="box-sizing: border-box; position: relative;">You can cancel your registration at any time, if you do not have an active online reservation, if you have it, you can only delete your profile after a telephone consultation</li></ul><p><span style="font-family: &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;"><br></span></p><p><span style="font-family: &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">If you have any questions, feel free to contact us,</span></p><p><strong>Voice - Beat Team</strong></p>','')
		
		

------RedRoomText = 7,
SET @currentText = NEWID();

INSERT INTO [dbo].[LivingTexts]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LivingTextType],[IsHtmlEncoded])
     VALUES
           (@currentText,GETDATE(),@systemId,null,null,1,7,1)

INSERT INTO [dbo].[Translations]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LanguageId],[LivingTextId],[Text],[Subject])
     VALUES
           (NEWID(),GETDATE(),@systemId,null,null,1,@huId,@currentText,'Ezt a termet koncertek begyakorlására is ajánljuk.','')

INSERT INTO [dbo].[Translations]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LanguageId],[LivingTextId],[Text],[Subject])
     VALUES
           (NEWID(),GETDATE(),@systemId,null,null,1,@enId,@currentText,'We also recommend this room for concerts.','')
		      
		

------RedRoomPrice = 8,
SET @currentText = NEWID();

INSERT INTO [dbo].[LivingTexts]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LivingTextType],[IsHtmlEncoded])
     VALUES
           (@currentText,GETDATE(),@systemId,null,null,1,8,1)

INSERT INTO [dbo].[Translations]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LanguageId],[LivingTextId],[Text],[Subject])
     VALUES
           (NEWID(),GETDATE(),@systemId,null,null,1,@huId,@currentText,'2500 Ft / óra','')

INSERT INTO [dbo].[Translations]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LanguageId],[LivingTextId],[Text],[Subject])
     VALUES
           (NEWID(),GETDATE(),@systemId,null,null,1,@enId,@currentText,'2500 Huf / hour','')
		      
		

------BlueRoomText = 9,
SET @currentText = NEWID();

INSERT INTO [dbo].[LivingTexts]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LivingTextType],[IsHtmlEncoded])
     VALUES
           (@currentText,GETDATE(),@systemId,null,null,1,9,1)

INSERT INTO [dbo].[Translations]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LanguageId],[LivingTextId],[Text],[Subject])
     VALUES
           (NEWID(),GETDATE(),@systemId,null,null,1,@huId,@currentText,'A kék terem felszerelése és elrendezése az általános igényekhez, egyszerű zenekari próbákhoz lett kialakítva. Igény esetén menedzseri és fellépési lehetőséget is tudunk biztosítani zenekaraink részére','')

INSERT INTO [dbo].[Translations]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LanguageId],[LivingTextId],[Text],[Subject])
     VALUES
           (NEWID(),GETDATE(),@systemId,null,null,1,@enId,@currentText,'The equipment and layout of the blue room has been designed for general needs, simple orchestral rehearsals. If required, we can also provide management and performance opportunities for our bands.','')
		      
		

------BlueRoomPrice = 10,
SET @currentText = NEWID();

INSERT INTO [dbo].[LivingTexts]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LivingTextType],[IsHtmlEncoded])
     VALUES
           (@currentText,GETDATE(),@systemId,null,null,1,10,1)

INSERT INTO [dbo].[Translations]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LanguageId],[LivingTextId],[Text],[Subject])
     VALUES
           (NEWID(),GETDATE(),@systemId,null,null,1,@huId,@currentText,'2500 Ft / óra','')

INSERT INTO [dbo].[Translations]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LanguageId],[LivingTextId],[Text],[Subject])
     VALUES
           (NEWID(),GETDATE(),@systemId,null,null,1,@enId,@currentText,'2500 Huf / hour','')
		      
		

------GrayRoomText = 11,
SET @currentText = NEWID();

INSERT INTO [dbo].[LivingTexts]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LivingTextType],[IsHtmlEncoded])
     VALUES
           (@currentText,GETDATE(),@systemId,null,null,1,11,1)

INSERT INTO [dbo].[Translations]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LanguageId],[LivingTextId],[Text],[Subject])
     VALUES
           (NEWID(),GETDATE(),@systemId,null,null,1,@huId,@currentText,'A szürke terem felszerelése és elrendezése az általános igényekhez, egyszerű zenekari próbákhoz lett kialakítva. Igény esetén menedzseri és fellépési lehetőséget is tudunk biztosítani zenekaraink részére.','')

INSERT INTO [dbo].[Translations]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LanguageId],[LivingTextId],[Text],[Subject])
     VALUES
           (NEWID(),GETDATE(),@systemId,null,null,1,@enId,@currentText,'The equipment and layout of the gray room was designed for general needs, simple orchestral rehearsals. If required, we can also provide management and performance opportunities for our bands.','')
		      
		

------GrayRoomPrice = 12,
SET @currentText = NEWID();

INSERT INTO [dbo].[LivingTexts]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LivingTextType],[IsHtmlEncoded])
     VALUES
           (@currentText,GETDATE(),@systemId,null,null,1,12,1)

INSERT INTO [dbo].[Translations]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LanguageId],[LivingTextId],[Text],[Subject])
     VALUES
           (NEWID(),GETDATE(),@systemId,null,null,1,@huId,@currentText,'2500 Ft / óra','')

INSERT INTO [dbo].[Translations]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LanguageId],[LivingTextId],[Text],[Subject])
     VALUES
           (NEWID(),GETDATE(),@systemId,null,null,1,@enId,@currentText,'2500 Huf / hour','')
		      
		

------StudioRoomText = 13,
SET @currentText = NEWID();

INSERT INTO [dbo].[LivingTexts]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LivingTextType],[IsHtmlEncoded])
     VALUES
           (@currentText,GETDATE(),@systemId,null,null,1,13,1)

INSERT INTO [dbo].[Translations]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LanguageId],[LivingTextId],[Text],[Subject])
     VALUES
           (NEWID(),GETDATE(),@systemId,null,null,1,@huId,@currentText,'Hangstúdiónkban lehetőség van a zeneszámok külön sávokban való rögzítésére és a hangszerek és ének egyszerre történő felvételére is. Természetesen dalaitokat keverni is tudjuk.','')

INSERT INTO [dbo].[Translations]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LanguageId],[LivingTextId],[Text],[Subject])
     VALUES
           (NEWID(),GETDATE(),@systemId,null,null,1,@enId,@currentText,'In our sound studio, it is also possible to record songs in separate tracks and record instruments and vocals at the same time. Of course we can also mix your songs.','')
		      
		

------StudioRoomPrice = 14,
SET @currentText = NEWID();

INSERT INTO [dbo].[LivingTexts]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LivingTextType],[IsHtmlEncoded])
     VALUES
           (@currentText,GETDATE(),@systemId,null,null,1,14,1)

INSERT INTO [dbo].[Translations]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LanguageId],[LivingTextId],[Text],[Subject])
     VALUES
           (NEWID(),GETDATE(),@systemId,null,null,1,@huId,@currentText,'Stúdió: 5000 Ft / óra - Mastering: 15.000 Ft / szám','')

INSERT INTO [dbo].[Translations]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LanguageId],[LivingTextId],[Text],[Subject])
     VALUES
           (NEWID(),GETDATE(),@systemId,null,null,1,@enId,@currentText,'Studio: 5000 Huf / hour - Master: 15.000 Huf / song','')
		      

------MasterPrice = 15,
SET @currentText = NEWID();

INSERT INTO [dbo].[LivingTexts]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LivingTextType],[IsHtmlEncoded])
     VALUES
           (@currentText,GETDATE(),@systemId,null,null,1,15,1)

INSERT INTO [dbo].[Translations]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LanguageId],[LivingTextId],[Text],[Subject])
     VALUES
           (NEWID(),GETDATE(),@systemId,null,null,1,@huId,@currentText,'15.000 Ft / szám','')

INSERT INTO [dbo].[Translations]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LanguageId],[LivingTextId],[Text],[Subject])
     VALUES
           (NEWID(),GETDATE(),@systemId,null,null,1,@enId,@currentText,'15.000 Huf / song','')
		      

------StudioRoomPrice = 16,
SET @currentText = NEWID();

INSERT INTO [dbo].[LivingTexts]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LivingTextType],[IsHtmlEncoded])
     VALUES
           (@currentText,GETDATE(),@systemId,null,null,1,16,1)

INSERT INTO [dbo].[Translations]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LanguageId],[LivingTextId],[Text],[Subject])
     VALUES
           (NEWID(),GETDATE(),@systemId,null,null,1,@huId,@currentText,'5000 Ft / óra','')

INSERT INTO [dbo].[Translations]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LanguageId],[LivingTextId],[Text],[Subject])
     VALUES
           (NEWID(),GETDATE(),@systemId,null,null,1,@enId,@currentText,'5000 Huf / hour','')
		      

------PhoneNumber = 17,
SET @currentText = NEWID();

INSERT INTO [dbo].[LivingTexts]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LivingTextType],[IsHtmlEncoded])
     VALUES
           (@currentText,GETDATE(),@systemId,null,null,1,17,1)

INSERT INTO [dbo].[Translations]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LanguageId],[LivingTextId],[Text],[Subject])
     VALUES
           (NEWID(),GETDATE(),@systemId,null,null,1,@huId,@currentText,'+36 30 710 0661','')

INSERT INTO [dbo].[Translations]
           ([Id],[Created],[CreatedBy],[Modified],[ModifiedBy],[IsActive],[LanguageId],[LivingTextId],[Text],[Subject])
     VALUES
           (NEWID(),GETDATE(),@systemId,null,null,1,@enId,@currentText,'+36 30 710 0661','')
		      