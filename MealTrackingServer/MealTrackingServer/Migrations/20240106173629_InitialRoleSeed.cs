using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace MealTrackingServer.Migrations
{
    /// <inheritdoc />
    public partial class InitialRoleSeed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "83421d14-0ac9-452e-ad95-8f8ce3365e33", null, "Administrator", "ADMINISTRATOR" },
                    { "c979c20f-673d-45cc-a154-4d6400c91d25", null, "Viewer", "VIEWER" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "83421d14-0ac9-452e-ad95-8f8ce3365e33");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "c979c20f-673d-45cc-a154-4d6400c91d25");
        }
    }
}
