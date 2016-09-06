import {Component, OnInit} from 'angular2/core';
import {Session} from '../../../services/session';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {CanActivate} from 'angular2/router';
import {TutorService} from '../../../services/tutor';
import {Location} from 'angular2/platform/common';

@Component({
	selector: 'tutor-main',
	templateUrl: '/components/tutor/main/main.html',
	providers: [Session, TutorService],
	directives: [ROUTER_DIRECTIVES],
})
export class TutorMain implements OnInit {

	studentList: any = [];
	courseList: any = [];
	tutor_id: string;
	selectStudents: any = [];
	showRemoveStudent: boolean = false;
	selectedStudentsName: string = '';

	constructor(private _location: Location, private _session: Session, private _tutorService: TutorService, private _router: Router) {
		this.tutor_id = this._session.getCurrentId()
		var role=this._session.getCurrentRole();

		// console.log(tutor_id);
		// console.log(role);

		// if(tutor_id == '' || parseInt(role) != 1){
		// 	console.log('aaaaaaaa');
		// 	this._router.navigateByUrl('/login');
		// }



		this._session.setItem('editORadd', JSON.stringify({flag: false}));
		this._tutorService.getAllCourses({tutor_id: this.tutor_id}).subscribe((res)=>{
			this.courseList = res;
			console.log(res);
		});
		this._tutorService.getAllStudents({tutor_id: this.tutor_id}).subscribe((res)=>{
			this.studentList = res;
			this._session.setItem('TutorAllStudent', JSON.stringify(res))
		});


		console.log(this._location.path())
	}

	editStudent(student: any){
		console.log(student.student_id);
		this._session.setItem('editORadd', JSON.stringify({flag: true}));
		this._session.setItem('TutorStudent', JSON.stringify(student));
		this._router.navigate(['AddTutorStudent']);
	}


	ngOnInit(){
	}

	gotoStudentDetail(student: any){
		this._session.setItem('TutorStudent', JSON.stringify(student));
		this._router.navigate(['DetailTutorStudent']);
	}
	gotoDetail(course: any){
		this._session.setItem('TutorCourse', JSON.stringify(course));
		this._router.navigate(['DetailTutorCourse']);
	}

	gotoAddStudent(){
		var data = {
			student_id: Date.now(),
			firstName: '',
			lastName: '',
			DOB: '',
			username: '',
			hashed_pwd: '',
			other: '',
			phone: '',
		}

		this._session.setItem('editORadd', JSON.stringify({flag: false}));
		this._session.setItem('TutorStudent', JSON.stringify(data));

		this._router.navigate(['AddTutorStudent']);
	}

	beforeAssignStudent(course){
		this._session.setItem('AssignCourse', course.course_id)
	}

	onSelectCourse(value){
		this._session.setItem('SelectCourseWithId', value)
	}

	onSelectStudent(value){
		this._session.setItem('SelectStudentWithId', value)
	}

	studentAssign(){
		var id = this._session.getItem('SelectStudentWithId');
		if(!id) return false;

		let selectedId = this._session.getItem('AssignCourse');
		if(!selectedId) return false;

		let ids = [];
		ids.push(id);

		this._tutorService.setAssignStudentsWithCourse(selectedId,ids).subscribe((res)=>{
			console.log(res);
			this._router.navigateByUrl('/home/tutor/main');
			this._tutorService.getAllStudents({tutor_id: this.tutor_id}).subscribe((res)=>{
				this.studentList = res;
				this._session.setItem('TutorAllStudent', JSON.stringify(res))
			});

			this._tutorService.getAllCourses({tutor_id: this.tutor_id}).subscribe((res)=>{
				this.courseList = res;
				console.log(res);
			});

		});;
	}

	courseAssign(){
		var id = this._session.getItem('SelectCourseWithId');
		if(!id) return false;

		if(this.selectStudents.length == 0) return false;

		let ids = this.selectStudents;

		this._tutorService.setAssignStudentsWithCourse(id,ids).subscribe((res)=>{

			console.log(res);

			this._router.navigateByUrl('/home/tutor/main');

			this._tutorService.getAllStudents({tutor_id: this.tutor_id}).subscribe((res)=>{
				this.studentList = res;
				this._session.setItem('TutorAllStudent', JSON.stringify(res))
			});

			this._tutorService.getAllCourses({tutor_id: this.tutor_id}).subscribe((res)=>{
				this.courseList = res;
				console.log(res);
			});
		});

	}

	importAddStudent($event: any) {
	    var self = this;
	    var file:File = $event.target.files[0];
	    var myReader:FileReader = new FileReader();
	    myReader.readAsText(file);
	    var resultSet = [];
	  	 myReader.onloadend = function(e){
	      // you can perform an action with data read here
	      // as an example i am just splitting strings by spaces
	      var columns = myReader.result.split(/\r\n|\r|\n/g);
	      for (var i = 0; i < columns.length; i++) {
	          resultSet.push(columns[i].split(' '));
	      }
	      self._tutorService.addStudentCSV({result:resultSet, tutor_id: self._session.getCurrentId()}).subscribe((res)=>{
	 				self._tutorService.getAllStudents({tutor_id: self.tutor_id}).subscribe((res)=>{
						self.studentList = res;
						self._session.setItem('TutorAllStudent', JSON.stringify(res))
					});

					self._tutorService.getAllCourses({tutor_id: self.tutor_id}).subscribe((res)=>{
						self.courseList = res;
						console.log(res);
					});
	 		})
	 	}


	}

	assignCourseToStudent(){

	}

	assignStudentToCourse(){

	}

	gotoCourseByClick(){

	}

	doLogin(form: any) {

	}

	checkStudent(event, object){
		console.log(`coures  = ${JSON.stringify(object)}`);

		if(event.currentTarget.checked){
			this.selectStudents.push(object.student_id);
		}else{
			this.selectStudents = this.selectStudents.filter((o) => {
				return o != object.student_id;
			})
		}
		console.log(this.selectStudents);
	}

	removeStudent(){
		if(this.selectStudents.length == 0) return false;
		let instance = this;
		console.log(this.selectStudents);

		this._tutorService.removeStudentById(this.selectStudents).subscribe((res)=>{
			instance.selectStudents.map(function(id){
				instance.studentList = instance.studentList.filter(function(student){
					return student.student_id != id;
				})
				instance._session.setItem('TutorAllStudent', JSON.stringify(instance.studentList))
			})
		})
	}

	beforeRemoveStudent(){
		if(this.selectStudents.length == 0){
			this.showRemoveStudent = false;
			return false;
		}
		this.showRemoveStudent = true;
		let instance = this;
		var data = [];

		this.selectStudents.map((id) => {
			var element = this.studentList.filter((student) => { return student.student_id == id});
			console.log(element);
			data.push(`${element[0].firstName} ${element[0].lastName}`);
		});
		this.selectedStudentsName = data.join(',');
	}
}
