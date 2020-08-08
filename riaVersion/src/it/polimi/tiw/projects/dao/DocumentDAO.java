package it.polimi.tiw.projects.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

import it.polimi.tiw.projects.beans.Document;

public class DocumentDAO {
	
	private Connection con;
	
	public DocumentDAO(Connection connection) {
		this.con = connection;
	}
	
	public List<Document> findDocumentsBySubFolderID (int sfolderId) throws SQLException{
		
		List<Document> documents = new ArrayList<Document>();
		String query = "SELECT * FROM document WHERE idSubfolder = ?";
		ResultSet result = null;
		PreparedStatement pstatement = null;
		
		try {
			pstatement = con.prepareStatement(query);
			pstatement.setInt(1, sfolderId);
			result = pstatement.executeQuery();
			while (result.next()) {
				Document d = new Document();
				d.setId(result.getInt("iddocument"));
				d.setName(result.getString("name"));
				d.setDate(result.getDate("date"));
				d.setSubFolderId(result.getInt("idSubfolder"));
				d.setSummery(result.getString("summary"));
				d.setType(result.getString("type"));
		
				documents.add(d);
			}
		} catch (SQLException e) {
			throw new SQLException(e);

		} finally {
			try {
				result.close();
			} catch (Exception e1) {
				throw new SQLException("Cannot close result");
			}
			try {
				pstatement.close();
			} catch (Exception e1) {
				throw new SQLException("Cannot close statement");
			}
		}
		return documents;
	}
	
	public void moveDocument(int subfolderId, int documentId)  throws SQLException{
		
		String query = "UPDATE document set idSubfolder = ? WHERE iddocument = ?";
		PreparedStatement pstatement = null;
		try {
			pstatement = con.prepareStatement(query);
			pstatement.setInt(1, subfolderId);
			pstatement.setInt(2, documentId);
			pstatement.executeUpdate();
		} catch (SQLException e) {
			throw new SQLException(e);
		} finally {
			try {
				pstatement.close();
			} catch (Exception e1) {

			}
		}
		
	}
	

	public Document findDocumentByID (int Id) throws SQLException{
		
		Document d = new Document();
		String query = "SELECT * FROM document WHERE iddocument = ?";
		ResultSet result = null;
		PreparedStatement pstatement = null;
		
		try {
			pstatement = con.prepareStatement(query);
			pstatement.setInt(1, Id);
			result = pstatement.executeQuery();
			while (result.next()) {
				d.setId(result.getInt("iddocument"));
				d.setName(result.getString("name"));
				d.setDate(result.getDate("date"));
				d.setSubFolderId(result.getInt("idSubfolder"));
				d.setSummery(result.getString("summary"));
				d.setType(result.getString("type"));
		
			}
		} catch (SQLException e) {
			throw new SQLException(e);

		} finally {
			try {
				result.close();
			} catch (Exception e1) {
				throw new SQLException("Cannot close result");
			}
			try {
				pstatement.close();
			} catch (Exception e1) {
				throw new SQLException("Cannot close statement");
			}
		}
		return d;
	}
	
	
	
	
	
	

}
