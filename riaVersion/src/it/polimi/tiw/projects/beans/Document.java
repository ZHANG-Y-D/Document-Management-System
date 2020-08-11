package it.polimi.tiw.projects.beans;

import java.sql.Date;

public class Document {
	
	private String documentName;
	private String subFolderNameOfDocument;
	private String folderNameOfDocument;
	private Date dateOfDocument;
	private String summaryOfDocument;
	private String typeOfDocument;
	
	
	public String getDocumentName() {
		return documentName;
	}

	public void setDocumentName(String a) {
		documentName = a;
	}
	
	public String getSubFolderName() {
		return subFolderNameOfDocument;
	}

	public void setSubFolderName(String a) {
		subFolderNameOfDocument = a;
	}
	
	public String getFolderName() {
		return folderNameOfDocument;
	}

	public void setFolderName(String a) {
		folderNameOfDocument = a;
	}
	
	public Date getDate() {
		return dateOfDocument;
	}
	
	public String getSummary() {
		return summaryOfDocument;
	}
	
	public String getType() {
		return typeOfDocument;
	}
	
	
	public void setDate(Date date) {
		this.dateOfDocument = date;
	}
	
	
	public void setType (String t) {
		typeOfDocument = t;
	}
	
	public void setSummery(String s) {
		summaryOfDocument = s;
	}

}
