package com.google.sps.servlets;

import com.google.gson.Gson;
import com.google.sps.database.JDBCLib;

import com.google.sps.objects.Report;
import com.google.sps.utilities.Http;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;

/**
 * Handles requests sent to the /text-form-handler URL. Takes given list and tries to sort and return it.
 */


@WebServlet("/list-by-date-and-coordinates")
@MultipartConfig

public class ListByDateServlet extends HttpServlet {

    JDBCLib database;
    Gson gson;
    Http http;

    public ListByDateServlet() {
        database = new JDBCLib();
        gson = new Gson();
        http = new Http();
    }

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {

        String start = http.getParameter(request, "start", "");
        String end = http.getParameter(request, "end", "");

        ArrayList<Report> reports = null;

        try {
            reports = database.listByDateAndCoordinates(start, end);
        } catch (SQLException sqlException) {
            ServletException servletException = new ServletException(sqlException.getMessage());
            servletException.setStackTrace(sqlException.getStackTrace());
            throw servletException;
        }

        String jsonReport = gson.toJson(reports);
        response.setContentType("text/html;");
        response.getWriter().println(jsonReport);
    }
}
