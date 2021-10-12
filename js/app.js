import { createApp, reactive } from 'https://unpkg.com/petite-vue?module';

//YOUR GITHUB REPO API URL GOES HERE :)
const MY_REPOS_URL = "https://api.github.com/users/Pasquale-Favella/repos";

const store = reactive({
  menuOpen: false,
  aboutTabSelected : "skills",
  filters :['all'],
  filterItems :[],
  filterSelected : "all",
  gitImages:[
    'https://www.drupal.org/files/project-images/GitHub-Mark.png',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfxIMC74mcZWZALBoj2-R9Yh7YvSGo9lQDWg&usqp=CAU',
    'https://s3.amazonaws.com/kinlane-productions2/bw-icons/bw-github-api.png',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSB14GcLNb-CVDJiYfM_16xVaaN3Tw9T7SLFw&usqp=CAU',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqOG5cOizkfKI2kd0_KXigwfsjXnGnkENj8A&usqp=CAU',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ41gV-ruVf6yOW8cPnt1JN9xnyOM0jMTJTGQ&usqp=CAU',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRE9nUXh-8-qf5TnO0-t5KF1WLa06qKUU438g&usqp=CAU'
  ],
  popupData : null,
  popupMoreDetails : false,
  popupImageSliderIndex : 0,
  isLoading : false,
  currentView : 'home',
  isDarkMode : true,

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  },
  switchTab(targetTab) {
    this.aboutTabSelected = targetTab;
  },
  setFilter(filter){
    this.filterSelected = filter;
  },
  gitImage(){
    return this.gitImages[Math.floor(Math.random()*this.gitImages.length)];
  },
  setPopUpData(item){

      if(!Boolean(item)) {
        this.popupMoreDetails = false;
        this.popupImageSliderIndex = 0;
      }

      this.popupData = item;
      document.body.classList.toggle("stop-scrolling");
  },
  togglePopUpMoreDetails(){
    this.popupMoreDetails = !this.popupMoreDetails;
  },
  nextPopUpImage(){

    if(this.popupImageSliderIndex === this.gitImages.length-1){
        this.popupImageSliderIndex = 0;
    }else{
        this.popupImageSliderIndex++;
    }


  },
  prevPopUpImage(){

    if(this.popupImageSliderIndex === 0){
        this.popupImageSliderIndex = this.gitImages.length-1;
    }else{
        this.popupImageSliderIndex--;
    }

  },
  setCurrentView(view){
    this.currentView = view;
    this.toggleMenu();
  },
  setCurrentViewByButton(view){
    this.currentView = view;
  },
  toggleTheme(){
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('light');
  },
  async getGitHubRepos(){

    try{
        this.isLoading = true;

        const response = await fetch(MY_REPOS_URL);
        const reposData = await response.json();

        let filterKeys = reposData.reduce(( prevRepo ,currRepo)=>{
           
            currRepo.projectImages = this.gitImages;
            this.filterItems.push(currRepo);
            return [...prevRepo,currRepo.language]
        },[]);

        //order by latest pushed repo
        this.filterItems = this.filterItems.sort((firstCompare,secondCompare)=> new Date(secondCompare.pushed_at) - new Date(firstCompare.pushed_at));

        this.filters = [...this.filters , ...new Set(filterKeys)];
        this.isLoading = false;

    }catch(error){
        console.error(error);
        this.filters = ['all'];
    }finally{
      this.isLoading = false;
    }
    
  }

});

store.getGitHubRepos();

createApp({
  // share it with app scopes
  store
}).mount();