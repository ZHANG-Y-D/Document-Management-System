package it.polimi.tiw.projects.beans;

import java.sql.Date;

public class Folder {
	private String folderName;
	private Date date;

	public String getFolderName() {
		return folderName;
	}

	public void setFolderName(String un) {
		folderName = un;
	}
	
	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

}
