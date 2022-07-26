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

/**
 * Handles requests sent to the /text-form-handler URL. Takes given list and tries to sort and return it.
 */


@WebServlet("/get-by-id")
@MultipartConfig

public class GetByIdServlet extends HttpServlet {

    JDBCLib database;
    Gson gson;
    Http http;

    public GetByIdServlet() {
        database = new JDBCLib();
        gson = new Gson();
        http = new Http();
    }

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {

        String entryID = http.getParameter(request, "entryID", "");
        Report report = null;

        try {
             report = database.getReport(entryID);
        } catch (SQLException sqlException) {
            ServletException servletException = new ServletException(sqlException.getMessage());
            servletException.setStackTrace(sqlException.getStackTrace());
            throw servletException;
        }

        if (report == null) {
            throw new ServletException("Entry ID not found");
        }

        String jsonReport = gson.toJson(report);
        response.setContentType("text/html;");
        response.getWriter().println(jsonReport);
    }
}
