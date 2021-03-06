SS-17

<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  
  <h3 align="center"> Salesforce - Source Delta Deploy (sf-sdd) </h3>

  <p align="center">
    Are you ready to finish your deploys in no time?!
    <br />
    <br />
    <br />
    <a href="https://www.youtube.com/watch?v=n0wU1zf0HIM">View Demo</a>
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

The Source Delta Deploy module is going to make your salesforce deployments a lot faster, as you propably have already noticed on the saleseforce project you are working, the repository is getting bigger and bigger and as a result the time of the deployments is increasing dramaticaly. Despite the time required to make a deployment, there is also a problem that its impossible to avoid easlily, the 'too many files in zip'. So what does sf-sdd do, is deploying each time the modified files and not the whole repository. in most cases the deploy can finish in seconds.

This module is addressed to salesforce project that use classic source format repository.

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

tools required

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

1. install module globally
   ```sh
   npm i sf-sdd -g
   ```
2. Add on .gitignore file the delta_deploy folder
3. Modify the build.xml so that deployroot points to the delta_deploy/package folder
   ```
    <target name="deployCode">
      <sf:deploy username="${sf.username}" password="${sf.password}" serverurl="${sf.serverurl}" deployroot="delta_deploy/package">
      </sf:deploy>
    </target>
    ```
4. Run the command (generates package.xml + copies the files inside the deployable folder)
   ```sh 
    sf-sdd -d targetbranch
   ```
5. excecute ant migration tool
   
<p align="right">(<a href="#top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

Used to increase the speed of the deployments.

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
