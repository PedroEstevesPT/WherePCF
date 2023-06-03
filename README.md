# Where PCF


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


6) Rename the solution
 pac solution rename --path "C:\Users\pedroesteves\Desktop\WherePCF\solution\bin\Debug\solution.zip" --new-name "WherePCF"
