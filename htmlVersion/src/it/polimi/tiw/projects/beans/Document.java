package it.polimi.tiw.projects.beans;

import java.sql.Date;

public class Document {
	
	private String DocumentName;
	private String subFolderName;
	private String folderName;
	private Date date;
	private String summary;
	private String type;
	
	
	public String getDocumentName() {
		return DocumentName;
	}

	public void setDocumentName(String a) {
		DocumentName = a;
	}
	
	public String getSubFolderName() {
		return subFolderName;
	}

	public void setSubFolderName(String a) {
		subFolderName = a;
	}
	
	public String getFolderName() {
		return folderName;
	}

	public void setFolderName(String a) {
		folderName = a;
	}
	
	public Date getDate() {
		return date;
	}
	
	public String getSummary() {
		return summary;
	}
	
	public String getType() {
		return type;
	}
	
	
	public void setDate(Date date) {
		this.date = date;
	}
	
	
	public void setType (String t) {
		type = t;
	}
	
	public void setSummery(String s) {
		summary = s;
	}

}
