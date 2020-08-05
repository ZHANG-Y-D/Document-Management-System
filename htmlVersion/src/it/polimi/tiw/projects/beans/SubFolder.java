package it.polimi.tiw.projects.beans;

import java.sql.Date;

public class SubFolder extends Folder {
	private String name;
	private Date date;
	private int id;
	private int folderId;
	
	public void setFolderId(int i) {
		folderId = i;
	}
	
	public int getFolderId() {
		return folderId;
	}
	

}
