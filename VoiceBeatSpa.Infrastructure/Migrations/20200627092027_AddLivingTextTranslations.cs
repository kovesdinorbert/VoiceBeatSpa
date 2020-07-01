using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace VoiceBeatSpa.Infrastructure.Migrations
{
    public partial class AddLivingTextTranslations : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Subject",
                table: "LivingTexts");

            migrationBuilder.DropColumn(
                name: "Text",
                table: "LivingTexts");

            migrationBuilder.CreateTable(
                name: "Languages",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Code = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Languages", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Translations",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Created = table.Column<DateTime>(nullable: false),
                    CreatedBy = table.Column<Guid>(nullable: false),
                    Modified = table.Column<DateTime>(nullable: true),
                    ModifiedBy = table.Column<Guid>(nullable: true),
                    IsActive = table.Column<bool>(nullable: false),
                    LanguageId = table.Column<Guid>(nullable: false),
                    LivingTextId = table.Column<Guid>(nullable: false),
                    Text = table.Column<string>(nullable: true),
                    Subject = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Translations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Translations_Languages_LanguageId",
                        column: x => x.LanguageId,
                        principalTable: "Languages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Translations_LivingTexts_LivingTextId",
                        column: x => x.LivingTextId,
                        principalTable: "LivingTexts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Translations_LanguageId",
                table: "Translations",
                column: "LanguageId");

            migrationBuilder.CreateIndex(
                name: "IX_Translations_LivingTextId",
                table: "Translations",
                column: "LivingTextId");

            migrationBuilder.Sql(@"INSERT INTO [dbo].[Languages] ([Id],[Code])
                                   VALUES (NEWID(), 'hu')");
            migrationBuilder.Sql(@"INSERT INTO [dbo].[Languages] ([Id],[Code])
                                   VALUES (NEWID(), 'en')");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Translations");

            migrationBuilder.DropTable(
                name: "Languages");

            migrationBuilder.AddColumn<string>(
                name: "Subject",
                table: "LivingTexts",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Text",
                table: "LivingTexts",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
