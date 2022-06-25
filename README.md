<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  
  <h3 align="center">Source Delta Deploy</h3>

  <p align="center">
    Are you ready to finish your deploys in no time?!
    <br />
    <br />
    <br />
    <a href="https://github.com/Skidrow17/salesforce-delta-deploy-source-format/issues">View Demo</a>
    ·
    <a href="https://github.com/Skidrow17/salesforce-delta-deploy-source-format/issues">Report Bug</a>
    ·
    <a href="https://github.com/Skidrow17/salesforce-delta-deploy-source-format/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

The Source Delta Deploy Project is going to make your salesforce deploys a lot faster, as you propably have already mentioned on the project the saleseforce project you are working, the repository is getting bigger and bigger and as a result the time of the deplys are increasing dramaticaly. Despite the time required to make a deploy, there is also a problem that its impossible to avoid easlily, the 'too many files in zip'. So what does delta deploy do is deploying each time the modified files and not the whole repository. in most cases the deploy can finish in seconds.

The Project is addressed to salesforce project that use the source format and using ant to make their deploys.

In case you use SFDX format please refere to https://github.com/scolladon/sfdx-git-delta 

<p align="right">(<a href="#top">back to top</a>)</p>



### Technologies Used

* [Node.js](https://nodejs.org/en/)
* [JSON](https://www.json.org/json-en.html)


<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

In Order to install these feature on your repository follow the steps below!

### Prerequisites

tools required to be installed

* npm
  ```sh
  npm install npm@latest -g
  ```
* ant migration tool
  ```sh
  https://developer.salesforce.com/docs/atlas.en-us.daas.meta/daas/meta_development.htm
  ```
* git
  ```sh
  https://git-scm.com/downloads
  ```
  
### Installation

_Below is an example of how you can instruct your audience on installing and setting up your app. This template doesn't rely on any external dependencies or services._

1. Clone the repo
   ```sh
   https://github.com/Skidrow17/salesforce-delta-deploy-source-format.git
   ```
2. Copy the files inside your salesforce project folder
3. Add on .gitignore file the DeltaDeploy folder
4. Modify the build.xml so that deployroot points to the DeltaDeploy/package folder
   ```
    <target name="deployCode">
      <sf:deploy username="${sf.username}" password="${sf.password}" serverurl="${sf.serverurl}" deployroot="DeltaDeploy/package">
      </sf:deploy>
    </target>
    ```

5. Install fs-extra library
   ```sh
   npm install fs-extra
   ```
6. Run the command (generates package.xml + copies the files inside the deployable folder)
   ```sh 
    node delta_deploy.js targetBranchNameYouWantToDeploy
   ```
7. excecute ant migration tool 
   
<p align="right">(<a href="#top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

Used to increase the speed of the deploys

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- CONTRIBUTING -->
## Contributing

In case you want to contribute to the project and extend its funcationality please be free.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b scpdd/MyContribution`)
3. Commit your Changes (`git commit -m 'Added my small Contribution'`)
4. Push to the Branch (`git push origin scpdd/MyContribution`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- CONTACT -->
## Contact

Silvan Sholla - (https://www.linkedin.com/in/silvan-sholla-1155bb162/)

Project Link: (https://github.com/Skidrow17/salesforce-delta-deploy-source-format)

<p align="right">(<a href="#top">back to top</a>)</p>
