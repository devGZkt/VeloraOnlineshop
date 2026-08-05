using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class FixedCategorySubcategoryProductRelations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_Subcategories_SubcategoryId1",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Products_SubcategoryId1",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "SubcategoryId1",
                table: "Products");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SubcategoryId1",
                table: "Products",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Products_SubcategoryId1",
                table: "Products",
                column: "SubcategoryId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Subcategories_SubcategoryId1",
                table: "Products",
                column: "SubcategoryId1",
                principalTable: "Subcategories",
                principalColumn: "SubcategoryId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
