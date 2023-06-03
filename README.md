# Where PCF

With this PCF, users are empowered to effortlessly explore and discover desired locations using Natural Language. 
Seamlessly integrating with the robust open source public API, specifically the esteemed https://nominatim.openstreetmap.org, this PCF harnesses its capabilities to procure an extensive list of locations that perfectly align with the user's natural language query. 
By doing so, it unveils an immersive experience by presenting not only the complete name of the locations, but also their precise geographic coordinates, enriching street maps, and insightful categorization of each retrieved place.

![image](https://github.com/PedroFortunatoEsteves/WherePCF/assets/14300941/0e3ef860-48d9-4024-84ea-b26155e1ef4b)



# To create the PCF:
pac pcf init --namespace pedroesteves --name WherePCF --template field


# To generate the solution file

1) Create a separated folder called solution and navigate to the solution folder:

pac solution init --publisher-name pedroesteves --publisher-prefix pe

2) Staying at the solution folder (make sure path is pointing to the pcf project)

pac solution add-reference --path 'C:\Users\pedroesteves\Desktop\WherePCF'

3) While inside the solution folder

msbuild /t:restore

4) in the project folder:

msbuild 

 The solution will be created in the WherePCF/solution/bin/Debug folder
 
 Other images:
 
![image](https://github.com/PedroFortunatoEsteves/WherePCF/assets/14300941/0f5f8dda-464b-4981-8007-b01faef1a07e)

