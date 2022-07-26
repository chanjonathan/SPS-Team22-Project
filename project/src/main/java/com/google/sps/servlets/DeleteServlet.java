package com.google.sps.servlets;

import com.google.sps.database.JDBCLib;
import com.google.sps.utilities.*;

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


@WebServlet("/delete")
@MultipartConfig

public class DeleteServlet extends HttpServlet {

    JDBCLib database;
    Http http;

    public DeleteServlet() {
        database = new JDBCLib();
        http = new Http();
    }

    @Override
    public void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        String entryID = http.getParameter(request, "entryID", "");

        try {
            database.delete(entryID);
        } catch (SQLException sqlException) {
            ServletException servletException = new ServletException(sqlException.getMessage());
            servletException.setStackTrace(sqlException.getStackTrace());
            throw servletException;
        }
    }
}
