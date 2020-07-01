using Microsoft.EntityFrameworkCore.Migrations;

namespace VoiceBeatSpa.Infrastructure.Migrations
{
    public partial class AddImages : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Token",
                table: "Users",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Discriminator",
                table: "FileDocuments",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Body",
                table: "FileDocuments",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ImageType",
                table: "FileDocuments",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "FileDocuments",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Token",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Discriminator",
                table: "FileDocuments");

            migrationBuilder.DropColumn(
                name: "Body",
                table: "FileDocuments");

            migrationBuilder.DropColumn(
                name: "ImageType",
                table: "FileDocuments");

            migrationBuilder.DropColumn(
                name: "Title",
                table: "FileDocuments");
        }
    }
}
