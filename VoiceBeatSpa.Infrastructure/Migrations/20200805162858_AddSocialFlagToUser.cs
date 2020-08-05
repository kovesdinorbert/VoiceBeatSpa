using Microsoft.EntityFrameworkCore.Migrations;

namespace VoiceBeatSpa.Infrastructure.Migrations
{
    public partial class AddSocialFlagToUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "SocialLogin",
                table: "Users",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SocialLogin",
                table: "Users");
        }
    }
}
