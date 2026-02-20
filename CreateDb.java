import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;
import java.util.Properties;

public class CreateDb {
    public static void main(String[] args) {
        String url = "jdbc:postgresql://localhost:5432/postgres";
        Properties props = new Properties();
        props.setProperty("user", "postgres");
        props.setProperty("password", "password");

        try (Connection conn = DriverManager.getConnection(url, props);
                Statement stmt = conn.createStatement()) {

            stmt.executeUpdate("CREATE DATABASE bleepbloop");
            System.out.println("Database bleepbloop created successfully.");

        } catch (Exception e) {
            if (e.getMessage().contains("already exists")) {
                System.out.println("Database bleepbloop already exists.");
            } else {
                e.printStackTrace();
                System.exit(1);
            }
        }
    }
}
