package com.google.sps.objects;

import java.util.ArrayList;

public class Report {

    public String title;
    public String latitude;
    public String longitude;
    public String date;
    public String description;
    public String contactDetails;
    public ArrayList<String> imageURLs;
    public String entryID;

    public Report(String title,
                  String latitude,
                  String longitude,
                  String date,
                  String description,
                  String contactDetails,
                  ArrayList<String> imageURLs,
                  String entryID) {

        this.title = title;
        this.latitude = latitude;
        this.longitude = longitude;
        this.date = date;
        this.description = description;
        this.contactDetails = contactDetails;
        this.imageURLs = imageURLs;
        this.entryID = entryID;
    }
}
