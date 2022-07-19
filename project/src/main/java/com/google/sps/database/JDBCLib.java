package com.google.sps.database;

import com.google.sps.objects.Report;

import java.sql.*;
import java.util.ArrayList;

public class JDBCLib {

    String url = "jdbc:mysql://34.134.208.240:3306/collisionReports";
    String user = "root";
    String password = "qw123456";

    // Require: reportDate of report object should be in the form of "YYYY-MM-DD"
    // Description: insert an entry into table collisionReports
    public void insert(Report report) throws SQLException {
        String Query = "INSERT INTO collisionReports (title, latitude, longitude, reportDate, reportDescription, " +
                "contactDetails, imageURL) \n" +
                "values (\"" + report.title + "\", \"" + report.latitude + "\", \"" + report.longitude +
                "\",  \"" + report.date + "\", \"" + report.description + "\", \"" +
                report.contactDetails + "\", \"" + report.imageURL + "\")";

        Connection connection = DriverManager.getConnection(url,
                user, password);

        Statement statement = connection.createStatement();

        statement.executeUpdate(Query);


    }

    // Description: print every entry in the table
    // used for test
    public void printEntries() throws SQLException {
        String QUERY = "SELECT * FROM collisionReports";

        try {

            Connection connection = DriverManager.getConnection(url,
                    user, password);

            Statement statement = connection.createStatement();

            ResultSet resultSet = statement.executeQuery(QUERY);

            while (resultSet.next()) {
                System.out.println(resultSet.getString("title"));
                System.out.println(resultSet.getString("latitude"));
                System.out.println(resultSet.getString("longitude"));
                System.out.println(resultSet.getString("reportDate"));
                System.out.println(resultSet.getString("reportDescription"));
                System.out.println(resultSet.getString("contactDetails"));
                System.out.println(resultSet.getString("imageURL"));
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // Description: delete an entry with the given entryID in the table
    public void delete(String entryID) throws SQLException {
        String Query = "delete from collisionReports where entryID = " + entryID; // "change to 21 ti works"


        Connection connection = DriverManager.getConnection(url,
                user, password);

        Statement statement = connection.createStatement();

        statement.executeUpdate(Query);


    }

    // Description: update an entry with the given entryID in the table
    // !!! make sure the entryID is correct
    public void update(Report report) throws SQLException {
        String entryID = report.entryID;
        String Query = "UPDATE collisionReports\n" +
                "SET title = \"" + report.title + "\", latitude = \"" + report.latitude + "\", longitude = \"" +
                report.latitude + "\", reportDate = \"" + report.date + "\", reportDescription = \"" +
                report.description + "\", contactDetails = \"" + report.contactDetails + "\", imageURL = \"" +
                report.imageURL + "\"\n" +
                "WHERE entryID = " + entryID + ";";

        Connection connection = DriverManager.getConnection(url,
                user, password);

        Statement statement = connection.createStatement();

        statement.executeUpdate(Query);

    }

    //
    public Report getEntry(String entryID) throws SQLException {
        String Query = "SELECT * FROM collisionReports where entryID = " + entryID;


        Connection connection = DriverManager.getConnection(url,
                user, password);

        Statement statement = connection.createStatement();

        ResultSet resultSet = statement.executeQuery(Query);

        while (resultSet.next()) {
            String title = resultSet.getString("title");
            String latitude = resultSet.getString("latitude");
            String longitude = resultSet.getString("longitude");
            String reportDate = resultSet.getString("reportDate");
            String reportDescription = resultSet.getString("reportDescription");
            String contactDetails = resultSet.getString("contactDetails");
            String imageURL = resultSet.getString("imageURL");

            Report report = new Report(title, latitude, longitude,
                    reportDate, reportDescription, contactDetails, imageURL, entryID);

            return report;
        }

        return null;


    }


    // return all the entries in the table as a list of reports
    public ArrayList<Report> getEntries() throws SQLException {
        String QUERY = "SELECT * FROM collisionReports";
        ArrayList<Report> reports = new ArrayList<>();


        Connection connection = DriverManager.getConnection(url,
                user, password);

        Statement statement = connection.createStatement();

        ResultSet resultSet = statement.executeQuery(QUERY);

        while (resultSet.next()) {
            String title = resultSet.getString("title");
            String latitude = resultSet.getString("latitude");
            String longitude = resultSet.getString("longitude");
            String reportDate = resultSet.getString("reportDate");
            String reportDescription = resultSet.getString("reportDescription");
            String contactDetails = resultSet.getString("contactDetails");
            String imageURL = resultSet.getString("imageURL");
            String entryID = resultSet.getString("entryID");

            Report report = new Report(title, latitude, longitude,
                    reportDate, reportDescription, contactDetails, imageURL, entryID);

            reports.add(report);
        }
        return reports;


    }

    // return all the entries in given time range
    public ArrayList<Report> listByDateAndCoordinates(String start, String end) throws SQLException {
        String query = "SELECT * FROM collisionReports " +
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
            String imageURL = resultSet.getString("imageURL");
            String entryID = resultSet.getString("entryID");

            Report report = new Report(title, latitude, longitude,
                    reportDate, reportDescription, contactDetails, imageURL, entryID);

            reports.add(report);
        }
        return reports;
    }
}