# Experience the History and Expansion of UK Campus | University of Kentucky
<!--a history of campus expansion-->
<!-- TOC -->

  - [I. Introduction](#i-introduction)
  - [II. Methodology](#ii-methodology)
    - [A. Data & Processing](#a-data--processing)
    - [B. Rephotography](#b-rephotography)
    - [C. Interface Design](#c-interface-design)
    - [D. Technology Stack](#d-technology-stack)
  - [III. Conclusion](#iii-conclusion)
  - [IV. References](#iv-references)

<!-- /TOC -->

*NOTE: My project examines the campus expansion of the University of Kentucky (UK) and its history. I am only examining the UK Lexington Main Campus located off of Nicholasville Road, not other properties around te city, county, or state. I also want to denote that UK has had various name changes since its founding but for simplicity sakes I will just be referring to the university as UK.*

![Original Campus](images/original_campus.jpg)

## I. Introduction

The University of Kentucky was founded in 1865. The original campus however was actually at the Ashland, the University did not move to its current location off of Nicholasville and Avenue of Champions until the 1880s. Ashland was sold to the John Bryan Bowman (founder of Kentucky University and Agricultural and Mechanical College of Kentucky) as a campus for the University in 1864, the wife of James B. Clay (son of Henry Clay) could no longer afford to stay at Ashland after her husband passed. 

UK separated from the private Kentucky University (Transylvania University today) to become a public institution under the Morrill Land Grant in 1865. Once UK separated they needed to obtain a campus, there was a state wide bidding war for the University to move to their cities. To encourage UK to stay in Lexington, Fayette County offered $20,000 and the city offered $30,000 and a large fairground (original campus). The university's permanent location was declared Lexington in 1880, and construction of the original campus began. Campus as it is known today opened in 1882 with three buildings: Main Building, White Hall Dormitory, and President Patterson's House. The main building is the only original structures still standing, White Hall Dormitory at Patterson House were demolished for the construction of Patterson Office Tower and White Hall Classroom Building in the 1960s. Since main campus opened there have been major changes to the campus landscape, and campus continues to acquire property for further expansion. 

![Historic CAD source](images/ashland_campus.jpg)
  **[University of Kentucky historical map, showing the Ashland and Limestone campuses from 1862-1882](https://exploreuk.uky.edu/catalog/xt7rn872zc2f)**

In my current position with UK Information Services group, I work closely with Facilities Management and Library datasets. Prior to development of this interactive map, older property deed details were fairly inaccessible and could only be located by searching through physical deeds in the Facilities Library. More recent parcel data can be obtained from LFUCG PVA; but the PVA merged older sections of campus into large parcels, instead of showing the original parcel size the property was purchased at. We have some historic parcel data in a CAD DWG document that was being maintained by an individual in Facilities Management, but it is not in an easily accessible format or location. For this project I geospatially referenced and digitized the data from the CAD document so it could be used as a layer for this interactive map. I created this map to allow users to easily explore UK parcel details and how campus has grown, while also examining how the campus landscape has changed over the decades through rephotography images. 

## II. Methodology
This project combines modern PVA parcel data with historic UK property acquisitions to develop a unique dataset. It is important to note that I am only examining the UK Lexington Main Campus located off of Nicholasville Road, not other properties around Lexington or the state. UK basemap features were provided from **[UK ITS Information Services - Geospatial](https://www.uky.edu/gissupport/sites/www.uky.edu.gissupport/files/Campus_Feature_Descriptions_0.pdf )**. Historic UK parcel data was provided by UK Facilities Management & UK ITS Information Services - Facilities Library. Modern Fayette County Parcel Data was sourced from **[Lexington Fayette Urban County Government (LFUCG)](https://data-lfucg.hub.arcgis.com/datasets/e4a525d8772741468205e82fc173db22_0/about)**. Points of Interest are based on selected historic photos of UK campus from UK Libraries **[Explore UKY](https://exploreuk.uky.edu/)**. ArcGIS Pro was used to develop and process all datasets. Additional information about the data and processing methods can be found below.  

### A. Data & Processing

**UK Basemap Features**
(UK ITS Information Services - Geospatial)
  - https://www.uky.edu/gissupport/sites/www.uky.edu.gissupport/files/Campus_Feature_Descriptions_0.pdf 
  - File created on UKY GIS Support Data page - September 29, 2021
  - Downloaded on February 2, 2022 as shapefiles	- Consists of: UK Buildings, Pavement, Road Centerline, Acquisition Boundary
  - Downloaded shapefile in projection NAD 1983 StatePlane Kentucky FIPS 1600 (US Feet) --> converted projection to WGS 1984, 4326, EPSG using Geoprocessing ArcPro 'Project Tool' 
   - Converted shapefile to a geoJSON using the ArcPro Geoprocessing Tool 'Features to JSON'
  - The information contained in this file is from multiple data sources maintained by the University of Kentucky’s ITS Information Services

**Fayette County Parcel Data**
(LFUCG)
  - https://data-lfucg.hub.arcgis.com/datasets/e4a525d8772741468205e82fc173db22_0/about
  - File created on LFUCG HUB - January 4, 2022
  - Downloaded on February 2, 2022 as a shapefile
  - Downloaded shapefile in WGS 1984, 4326, EPSG
  - Converted shapefile to a geoJSON using the ArcPro Geoprocessing Tool 'Features to JSON'
  - Clipped parcel data to the UK Ownership layer (UK Basemap Features) using the ArcPro Geoprocessing Tool 'Clip Layer' to reduce size of data 
  - Credits: LFUCG GIS, LFUCG Addressing, LFUCG Planning, Fayette County Property Valuation Administrator (PVA)

**Historic UK Parcel CAD Data**
(UK Facilities Management & UK ITS Information Services - Facilities Library)
  - Original data was developed using existing deed and plat information - NOT SURVEY QUALITY 
  - Parcel attributes were taken from the deeds and/or existing subdivision plats
  - Data is not complete and only shows parcels as described when they were conveyed to UK and does not show subsequent sales for road widening, easements, etc.
  ![Historic CAD source](images/autocad_screenshot.jpg)

**UK Parcel Acquisition Data (NEW DATASET)**
(UK ITS Information Services - Geospatial)
  - Converted Historic UK Parcel CAD Data to GDB using the ArcPro Geoprocessing Tool 'CAD to Geodatabase'
  - CAD data was not in a projected space, assigned the converted data a projection of WGS 1984, 4326, EPSG
  - "Georeferenced" converted CAD data to the UK Campus Basemap using the Geoprocessing ArcPro Tool 'Transform Features'- created links between the converted CAD data and GIS campus basemap (see images below)
  - Converted georeferenced CAD Annotations to a point feature class using the Geoprocessing ArcPro Tool 'Feature to Point' 
  - After georeferencing the Historic UK Parcel CAD data to the GIS UK basemap, created a new feature class (UK Parcel Acquisition) from the Fayette County Parcel data and added/edited new features from georeferenced Historic UK Parcels 
  - Combined the dataset attributes by performing a spatial join using the ArcPro Geoprocessing Tool 'Spatial Join', joined georeferenced CAD Annotation points to the new UK Parcel Acquisition layer that we were completely within a parcel feature
  - Assigned unique IDs by using the ArcPro Geoprocessing Tool 'Number Features'
  - Converted Features to a geoJSON using the ArcPro Geoprocessing Tool 'Features to JSON'
  ![Data processing methodology](images/data_process_readme.jpg)
  ![Spatial Join Infographic](https://datavisdotblog.files.wordpress.com/2022/01/spatial-joins-header.png)

    **[Spatial Join Infographic](https://datavis.blog/2022/01/06/spatial-joins-in-tableau/)**

**UK Points of Interest - POI (NEW DATASET)**
(UK ITS Information Services - Geospatial & UK Libraries - Explore UK)
  - Projection WGS 1984, 4326, EPSG
  - Selected historic photos of UK campus from https://exploreuk.uky.edu/ that could be recaptured today ([Rephotography](#b-rephotography))
  - Identified locations in historic photos based on key landmarks and added points to a geoJson layer
  - Photos edited using Adobe Photoshop, sized to 2500 px, and exported as jpg files
  - Completed research for each point, see [References](#iv-references) for more details

### B. Rephotography
A large aspect of this project is the "rephotography" of several historic sites around campus. [Rephotography](https://en.wikipedia.org/wiki/Rephotography) is the act of repeat photography of the same site, with a time lag between the two images; a "then and now" view of a particular area. To achieve this I looked through several historic photos of UK campus from https://exploreuk.uky.edu/ and selected images that could be recaptured today based on building features and other surrounding landmarks. I researched each of the photograph sites and wrote quick blurbs about them to further pull the user into the context of the location and get a deeper experience with the images.

![Rephotography snapshot of Taylor Education Building](images/rephotography_snapshot.jpg)

### C. Interface Design
The goal of this product to to create a full screen interactive map that will allow users to explore the history of campus expansion and relive historic moments through various sites on campus. The map will include three separate layers: Parcels, Buildings, and Points of Interest (POI). 

This interactive map was developed with a responsive web design to accommodate varying screen sizes and devices, but for the best user experience it is recommended to use a desktop application or larger mobile device. While it can be used on smaller mobile devices, the image comparison popups do not retain scale and distorts the images. The layout was developed using Bootstrap for website framework and layer toggling, jQuery for event handling and image comparison slider plugin, leaflet library for map functionality, and Mapbox for basemap tile layer. 

User Interaction includes:
- Parcel/Deed Layer - the parcel layer is symbolized by light blue polygons, when the user hovers over a parcel the polygon outline will change to yellow and a pop-up will appear. The pop-up include information about each deed: grantor, deed book, deed book page, deed date, address if known, and the PVA number and address. 
- Point of Interest (POI) Layer & Image Comparison Modal- the point of interest sites are symbolized by orange circles, when the user hovers hovers over one of these points a pop-up will display showing the historic image and site name for comparison. When a point is clicked a modal window with an image comparison slider will open, allowing users to compare the historic images to the location today. 
- Timeslider - map opens showing all owned parcels/property, the timeslider can be used to watch how the Lexington main campus has changed since its opening in 1880 to today 2022. Points of Interest are not filtered with the date slider, did not find the dates associated with the image reliable enough. 
- Layer List - the user has the capability to toggle on/off the parcels, points of interest, or buildings.
- Links to the github repo ReadMe ('About') and my portfolio ('Portfolio'). 
- 

![Interactive Parcel Ownership Map](images/parcelownership_wireframe.jpg)

### D. Technology Stack
- CSS/HTML/Javascript
- Google Font Library
- Leaflet JS
- jQuery 
  - jQuery Slider Bundle Plugin
- Bootstrap
  - Bootstrap Toggle Plugin

## III. Conclusion

UK's campus is ever changing, it is interesting to see how the University has grown since its founding in 1865. Through this project I learned so many little facts about campus that make my walks through campus a bit more inspiring than just seeing a bunch of buildings. I hope this map engages users with the history of UK's campus and helps them gain a better understanding of how campus got to where it is today and where it may go in the future. 

Later, I would like to have buildings update with the parcel time slider. We have all the information to achieve this but the pop-ups between the parcel and building polygons conflict with each other and at some points will not allow you to select smaller parcels under buildings. I am considering removing pop-ups from the parcel data and adding pop-ups for the buildings. The general public would not find the parcel details valuable, only valuable for FM personnel. I would also like to add a Road Ownership layer. Lastly improve for mobile use, I would like the image modal content to adjust dynamically with smaller screen sizes. Possibly create a scrollable story map with a some background information and discuss the importance of parcel data to go along with the interactive map. 

## IV. References

- "Ann Rice O'Hanlon & The Memorial Hall Mural: Memorial Hall." UK Libraries: Research Guides, https://libguides.uky.edu/c.php?g=436963&p=3100156. Accessed 2022. 

- "A Student's View of Campus Then & Now." UK Libraries: Special Collections Research Center, https://ukyscrcexhibits.omeka.net/exhibits/show/studentcampus. Accessed 2022.

- "College of Education History." UK College of Education, https://education.uky.edu/history/. Accessed 2022. 

- "Commonwealth Stadium." UK Athletics, https://ukathletics.com/sports/2015/8/2/_131472192333808916.aspx. Accessed 2022

- "Explore the University of Kentucky." Kentucky Historical Society: Explore KY History, https://explorekyhistory.ky.gov/tours/show/8. Accessed 2022.

- Hale, Whitney. "Sesquicentennial Series: A Place of Observation." UK College of Arts & Sciences: Physics & Astronomy, November 25, 2013, https://pa.as.uky.edu/sesquicentennial-series-place-observation.

- Hale, Whitney. "Sesquicentennial Stories: A Monumental Track" UK College of Arts & Sciences, May 21, 2013, https://www.as.uky.edu/sesquicentennial-stories-monumental-track. 

- Hale, Whitney. "Sesquicentennial Stories: UK's 'New' Dorm." UK College of Arts & Sciences: Modern & Classical Languages, Literatures & Culture, May 1, 2013, https://mcl.as.uky.edu/sesquicentennial-stories-uks-new-dorm. Accessed 2022.

- Harder, Whitney. "Cooperstown Makes its Mark in UK History." UKNOW - University of Kentucky News, November 13, 2014, https://uknow.uky.edu/campus-news/cooperstown-makes-its-mark-uk-history. 

- "History of the President's Residence, Maxwell Place." UK Office of the President, https://pres.uky.edu/history-maxwell-place-presidents-residence. Accessed 2022.

- Jones-Timoney, Amy, and Kody Kiser. "VIDEO: E.S. Good Barn Connects UK Campus With the Commonwealth." UKNOW - University of Kentucky News, January 20, 2015, https://uknow.uky.edu/campus-news/video-es-good-barn-connects-uk-campus-commonwealth.

- "Kentucky University at Ashland." The Henry Clay Estate - Ashland, https://henryclay.org/mansion-grounds/history-of-ashland/kentucky-university-at-ashland/. Accessed 2022. 

- "Mathews family papers." UK Libraries: Special Collections Research Center, https://exploreuk.uky.edu/fa/findingaid/?id=xt76q52f925g. Accessed 2022. 

- Nielson, Aimee. "Historic Cooper House." Issuu: College of Agriculture, Food and Environment Alumni Association, July 2021, https://issuu.com/aghesalumniassociation/docs/july_2021_ambassador_issuu/s/12678228. 

- "Old Blue". UK Libraries Special Collections Research Center, April, 30, 2009, https://ukyarchives.blogspot.com/2009/04/old-blue.html.

- "Past Men's Basketball Venues: Alumni Gym." UK Athletics, https://ukathletics.com/sports/2018/9/6/past-mens-basketball-venues-alumni-gym.aspx. Accessed 2022. 

- Thompson, Weston T., and Terry L. Birdwhistell. "The University of Kentucky: A Look Back."  UK Libraries: Special Collections Research Center, 1998, https://libraries.uky.edu/libpage.php?lweb_id=319&llib_id=13.

- "University of Kentucky Army ROTC History." UK College of Arts & Sciences: Army ROTC, https://armyrotc.as.uky.edu/university-kentucky-army-rotc-history. Accessed 2022. 

