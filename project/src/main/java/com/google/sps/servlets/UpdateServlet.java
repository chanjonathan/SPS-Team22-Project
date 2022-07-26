package com.google.sps.servlets;

import com.google.cloud.storage.*;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.google.sps.database.JDBCLib;
import com.google.sps.objects.Report;
import com.google.sps.utilities.Http;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Type;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Handles requests sent to the /text-form-handler URL. Takes given list and tries to sort and return it.
 */


@WebServlet("/put")
@MultipartConfig

public class UpdateServlet extends HttpServlet {

    JDBCLib database;
    Gson gson;
    Http http;

    public UpdateServlet() {
        database = new JDBCLib();
        gson = new Gson();
        http = new Http();
    }

    @Override
    public void doPut(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {

        String title = http.getParameter(request, "title", "");
        String latitude = http.getParameter(request, "latitude", "");
        String longitude = http.getParameter(request, "longitude", "");
        String date = http.getParameter(request, "date", "");
        String description = http.getParameter(request, "description", "");
        String contactDetails = http.getParameter(request, "contactDetails", "");
        String entryID = http.getParameter(request, "entryID", "");
        String jsonImageURLs = http.getParameter(request, "imageURLs", "");

        Type listType = new TypeToken<ArrayList<String>>() {
        }.getType();
        ArrayList<String> imageURLs = gson.fromJson(jsonImageURLs, listType);

        imageURLs = addImageURLs(request, imageURLs);

        Report report = new Report(title, latitude, longitude, date, description, contactDetails, imageURLs, entryID);

        try {
            database.update(report);
        } catch (SQLException sqlException) {
            ServletException servletException = new ServletException(sqlException.getMessage());
            servletException.setStackTrace(sqlException.getStackTrace());
            throw servletException;
        }
    }

    private ArrayList<String> addImageURLs(HttpServletRequest request, ArrayList<String> imageURLs) throws ServletException, IOException {
        List<Part> fileParts = request.getParts().stream().
                filter(part -> "images".equals(part.getName())).collect(Collectors.toList());
        for (Part filePart : fileParts) {
            if (filePart == null) {
                throw new ServletException("filepart is null");
            }
            String fileName = filePart.getSubmittedFileName();
            InputStream fileInputStream = filePart.getInputStream();

            if (fileName.compareTo("") != 0) {
                String uploadedFileUrl = uploadToCloudStorage(fileName, fileInputStream);
                if (uploadedFileUrl == null) {
                    uploadedFileUrl = "";
                }

                imageURLs.add(uploadedFileUrl);
            }
        }
        return imageURLs;
    }

    private static String uploadToCloudStorage(String fileName, InputStream fileInputStream) {
        fileName = System.currentTimeMillis() + fileName;

        String projectId = "jchan-sps-summer22";
        String bucketName = "jchan-sps-summer22.appspot.com";
        Storage storage = StorageOptions.newBuilder().setProjectId(projectId).build().getService();
        BlobId blobId = BlobId.of(bucketName, fileName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();

        Blob blob = storage.create(blobInfo, fileInputStream);

        return blob.getMediaLink();
    }
}
