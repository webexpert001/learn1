import {Component, OnInit} from 'angular2/core';
import {Session} from '../../../services/session';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {CanActivate} from 'angular2/router';
import {StudentService} from '../../../services/student';

@Component({
	selector: 'student-main',
	templateUrl: '/components/student/main/main.html',
	providers: [Session, StudentService],
	directives: [ROUTER_DIRECTIVES],
})
export class StudentMain implements OnInit {

	courseList: any = [];
	studentInfo: any;
	studentId: string;

	constructor(private _session: Session, private _studentService: StudentService, private _router: Router) {

		this._session.setItem('editORadd', JSON.stringify({flag: false}));
		this.studentId = this._session.getItem('MainStudentId');

		this._studentService.getCourseListById(this.studentId).subscribe((res)=>{
			this.courseList = res;
			console.log(res);
		})

		// this._studentService.getStudentInfo(this.studentId).subscribe((res)=>{
		// 	this.studentInfo = res;
		// })
	}

	ngOnInit(){

	}	

	gotoLessonList(course){
		this._session.setItem('selectedCourse', JSON.stringify(course));
		this._router.navigate(['StudentLesson']);
	}

	getHeadingClass(course: any){
		if(course.score > 70)
			return "panel-heading panel-completed";
		else
			return "panel-heading";
	}

	getCourseName(course: any){
		return this.titleCase(course.coursetitle);
	}

	getCurrentStatus(course: any){
		if(course.lock == false){
			return '';
		}
		if(course.score < 70){
			return 'In progress, ' + course.score + '% Complete';
		}
		if(course.score > 80){
			return 'Completed,'+ course.completedAt + ', Score '+ course.score + '%';
		}
	}

	private titleCase(str: string) : string {
	 	return str.split(' ').map(function(val){ 
	    	return val.charAt(0).toUpperCase() + val.substr(1).toLowerCase();
	  	}).join(' ');
	}
}