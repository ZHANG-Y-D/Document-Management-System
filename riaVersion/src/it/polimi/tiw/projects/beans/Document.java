package it.polimi.tiw.projects.beans;

import java.sql.Date;

public class Document {
	
	private String name;
	private Date date;
	private int id;
	private String summary;
	private String type;
	private int subfolderid;
	
	
	
	public int getId() {
		return id;
	}

	public String getName() {
		return name;
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
	
	public int getSubFolderId() {
		return subfolderid;
	}

	public void setId(int i) {
		id = i;
	}

	public void setName(String un) {
		name = un;
	}
	
	
	public void setDate(Date date) {
		this.date = date;
	}
	
	public void setSubFolderId(int id) {
		subfolderid = id;
	}
	
	public void setType (String t) {
		type = t;
	}
	
	public void setSummery(String s) {
		summary = s;
	}

}
