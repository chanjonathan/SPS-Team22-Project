package com.google.sps.database;

import com.google.sps.objects.Report;

import java.sql.*;
import java.util.ArrayList;

public class JDBCLib {

    String url = "jdbc:mysql://34.134.208.240:3306/collisionReports";
    String user = "root";
    String password = "qw123456";

    // Require: reportDate of report object should be in the form of "YYYY-MM-DD hh:mm:ss"
    // Description: insert an entry into table collisionReports
    public void insert(Report report) throws SQLException {

        Connection connection = DriverManager.getConnection(url, user, password);
        Statement statement = connection.createStatement();

        String InsertReportQuery = "INSERT INTO collisionReportsPro (title, latitude, longitude, reportDate, reportDescription, " +
                "contactDetails) \n" +
                "values (\"" + report.title + "\", \"" + report.latitude + "\", \"" + report.longitude +
                "\", '" + report.date + "\', \"" + report.description + "\", \"" +
                report.contactDetails + "\")";

        statement.executeUpdate(InsertReportQuery, Statement.RETURN_GENERATED_KEYS);
        ResultSet rs = statement.getGeneratedKeys();
        String entryID = "";
        if (rs.next()) {
            long entry = rs.getLong(1);
            entryID = Long.toString(entry);
        }

        //insert into imageAddresses;
        ArrayList<String> images = report.imageURLs;
        for (String img : images) {
            String InsertImageQuery = "INSERT INTO imageAddresses (imageURL, entryID) \n" +
                    "values (\"" + img + "\"," + entryID + ");";
            statement.executeUpdate(InsertImageQuery);
        }
    }

    // Description: print every entry in both tables
    // used for test
    public void printEntries() throws SQLException {
        String QUERY = "SELECT * FROM collisionReportsPro";
        String QUERY1 = "SELECT * FROM imageAddresses";

        Connection connection = DriverManager.getConnection(url, user, password);

        Statement statement = connection.createStatement();
        ResultSet resultSet = statement.executeQuery(QUERY);

        while (resultSet.next()) {
            System.out.println("entryID: " + resultSet.getString("entryID"));
            System.out.println("title: " + resultSet.getString("title"));
            System.out.println("latitude: " + resultSet.getString("latitude"));
            System.out.println("longitude: " + resultSet.getString("longitude"));
            System.out.println("reportDate: " + resultSet.getTimestamp("reportDate"));
            System.out.println("reportDescription:　" + resultSet.getString("reportDescription"));
            System.out.println("contactDetails： " + resultSet.getString("contactDetails"));
            System.out.println();
        }
        Statement statement1 = connection.createStatement();

        ResultSet resultSet1 = statement1.executeQuery(QUERY1);
        while (resultSet1.next()) {
            System.out.println("imageID: " + resultSet1.getString("imageID"));
            System.out.println("imageURL: " + resultSet1.getString("imageURL"));
            System.out.println("entryID: " + resultSet1.getString("entryID"));
            System.out.println();
        }
    }

    // Description: delete an entry with the given entryID in the table
    public void delete(String entryID) throws SQLException {
        String Query = "delete from collisionReportsPro where entryID = " + entryID;
        String Query1 = "delete from imageAddresses where entryID = " + entryID;

        Connection connection = DriverManager.getConnection(url, user, password);
        Statement statement = connection.createStatement();
        statement.executeUpdate(Query);

        statement.executeUpdate(Query1);
    }

    // Description: update an entry with the given entryID in the table
    // !!! make sure the entryID is correct
    public void update(Report report) throws SQLException {
        String Query = "UPDATE collisionReportsPro\n" +
                "SET title = \"" + report.title + "\", latitude = \"" + report.latitude + "\", longitude = \"" +
                report.longitude + "\", reportDescription = \"" + report.description +
                "\", reportDate = \"" + report.date +
                "\", contactDetails = \"" + report.contactDetails + "\"\n" +
                "WHERE entryID = " + report.entryID + ";";

        String DELETE_IMAGE_URL = "delete from imageAddresses where entryID = " + report.entryID;

        Connection connection = DriverManager.getConnection(url, user, password);
        Statement statement = connection.createStatement();
        statement.executeUpdate(Query);
        statement.executeUpdate(DELETE_IMAGE_URL);

        ArrayList<String> images = report.imageURLs;
        for (String img : images) {
            String InsertImageQuery = "INSERT INTO imageAddresses (imageURL, entryID) \n" +
                    "values (\"" + img + "\"," + report.entryID + ");";
            statement.executeUpdate(InsertImageQuery);
        }
    }


    public Report getReport(String entryID) throws SQLException {
        String Query = "SELECT * FROM collisionReportsPro where entryID = " + entryID;

        Connection connection = DriverManager.getConnection(url, user, password);
        Statement statement = connection.createStatement();
        ResultSet resultSet = statement.executeQuery(Query);

        if (resultSet.next()) {
            String title = resultSet.getString("title");
            String latitude = resultSet.getString("latitude");
            String longitude = resultSet.getString("longitude");
            String reportDate = resultSet.getTimestamp("reportDate").toString();
            String reportDescription = resultSet.getString("reportDescription");
            String contactDetails = resultSet.getString("contactDetails");

            Statement statement1 = connection.createStatement();
            String GET_URLS = "SELECT * FROM imageAddresses WHERE entryID = " + entryID;
            ResultSet resultSet1 = statement1.executeQuery(GET_URLS);

            ArrayList<String> URLs = new ArrayList<>();

            while (resultSet1.next()) {
                String imageURL = resultSet1.getString("imageURL");
                URLs.add(imageURL);
            }

            return new Report(title, latitude, longitude,
                    reportDate, reportDescription, contactDetails, URLs, entryID);
        } else {
            return null;
        }
    }


    public ArrayList<Report> getEntries() throws SQLException {
        String QUERY = "SELECT * FROM collisionReportsPro";
        ArrayList<Report> reports = new ArrayList<>();

        Connection connection = DriverManager.getConnection(url, user, password);
        Statement statement = connection.createStatement();
        ResultSet resultSet = statement.executeQuery(QUERY);

        while (resultSet.next()) {
            ArrayList<String> URLs = new ArrayList<>();
            String title = resultSet.getString("title");
            String latitude = resultSet.getString("latitude");
            String longitude = resultSet.getString("longitude");
            String reportDate = resultSet.getTimestamp("reportDate").toString();
            String reportDescription = resultSet.getString("reportDescription");
            String contactDetails = resultSet.getString("contactDetails");
            String entryID = resultSet.getString("entryID");

            String GET_URLS = "SELECT * FROM imageAddresses WHERE entryID = " + entryID;

            Statement statement1 = connection.createStatement();
            ResultSet resultSet1 = statement1.executeQuery(GET_URLS);

            while (resultSet1.next()) {
                String imageURL = resultSet1.getString("imageURL");
                URLs.add(imageURL);
            }

            Report report = new Report(title, latitude, longitude,
                    reportDate, reportDescription, contactDetails, URLs, entryID);

            reports.add(report);
        }
        return reports;
    }

    // return all the entries in given time range
    public ArrayList<Report> listByDateAndCoordinates(String start, String end) throws SQLException {
        String query = "SELECT * FROM collisionReportsPro " +
                "WHERE reportDate between '" + start + "'  and   '" + end + "';";

        ArrayList<Report> reports = new ArrayList<>();

        Connection connection = DriverManager.getConnection(url, user, password);
        Statement statement = connection.createStatement();
        ResultSet resultSet = statement.executeQuery(query);

        while (resultSet.next()) {
            String title = resultSet.getString("title");
            String latitude = resultSet.getString("latitude");
            String longitude = resultSet.getString("longitude");
            String reportDate = resultSet.getString("reportDate");
            String reportDescription = resultSet.getString("reportDescription");
            String contactDetails = resultSet.getString("contactDetails");
            String entryID = resultSet.getString("entryID");

            ArrayList<String> URLs = new ArrayList<>();
            String GET_URLS = "SELECT * FROM imageAddresses WHERE entryID = " + entryID;
            Statement statement1 = connection.createStatement();
            ResultSet resultSet1 = statement1.executeQuery(GET_URLS);

            while (resultSet1.next()) {
                String imageURL = resultSet1.getString("imageURL");
                URLs.add(imageURL);
            }

            Report report = new Report(title, latitude, longitude,
                    reportDate, reportDescription, contactDetails, URLs, entryID);

            reports.add(report);
        }
        return reports;
    }

    // return the reports at a given coordinate
    public ArrayList<Report> listByCoordinates(String latitude, String longitude) throws SQLException {
        String query = "select * from collisionReportsPro where latitude = " + latitude + " AND longitude = " + longitude;

        ArrayList<Report> reports = new ArrayList<>();

        Connection connection = DriverManager.getConnection(url, user, password);
        Statement statement = connection.createStatement();
        ResultSet resultSet = statement.executeQuery(query);

        while (resultSet.next()) {
            String entryID = resultSet.getString("entryID");
            reports.add(getReport(entryID));
        }
        return reports;
    }
}