# Generic Multifield for AEM 6.3

| System     | Status                                                                                                                                                                                                                                                                |
|------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| CI master  | [![release and deploy](https://github.com/merkle-open/aem-generic-multifield/actions/workflows/release-and-deploy-release.yml/badge.svg?branch=6.3%2Fmaster)](https://github.com/merkle-open/aem-generic-multifield/actions/workflows/release-and-deploy-release.yml) |
| CI develop | [![deploy snapshot](https://github.com/merkle-open/aem-generic-multifield/actions/workflows/deploy-snapshot.yml/badge.svg?branch=6.3%2Fdevelop)](https://github.com/merkle-open/aem-generic-multifield/actions/workflows/deploy-snapshot.yml)                         |
| Dependency | [![Maven Central](https://maven-badges.herokuapp.com/maven-central/com.namics.oss.aem/genericmultifield/badge.svg?version=1.0.5)](https://search.maven.org/artifact/com.namics.oss.aem/genericmultifield/1.0.5/bundle)                                                |

With this project you can use a widget in [Adobe Experience Manager 6.3](https://helpx.adobe.com/experience-manager/6-3/release-notes.html) Touch UI which lets you create a generic multifield in a dialog.

## Usage

### Maven Dependency
```
    <dependency>
      <groupId>com.namics.oss.aem</groupId>
      <artifactId>genericmultifield</artifactId>
      <version>1.0.5</version>
    </dependency>
```

### in AEM
Since the Generic Multifield is built as an OSGi bundle, only the bundle has to be installed into your AEM instance. 
With the common AEM archetype it can be added within the embedded configuration of the "content-package-maven-plugin" plugin.
```xml
    <plugin>
        <groupId>com.day.jcr.vault</groupId>
        <artifactId>content-package-maven-plugin</artifactId>
        <extensions>true</extensions>
        <configuration>
            ...
            <embeddeds>
                <embedded>
                    <groupId>com.namics.oss.aem</groupId>
                    <artifactId>genericmultifield</artifactId>
                    <target>/apps/myProject/install</target>
                </embedded>
            </embeddeds>
        </configuration>
    </plugin>
```

 
#### Dialog
Use the Generic Multifield in your _cq_dialog.xml of a AEM 6.3 (with Touch UI) like this example:
```xml
    <genericmultifield
        jcr:primaryType="nt:unstructured"
        sling:resourceType="namics/genericmultifield"
        fieldLabel="Generic Multifield"
        itemDialog="path/to/a/item-dialog"
        itemStorageNode="items"
        itemNameProperty="title"
        name="./items"
        minElements="3"
        maxElements="5"
        required="{Boolean}true" />
```

Example dialog:

![main dialog](docs/main.png)

#### Item-Dialog
```xml
    <jcr:root xmlns:sling="http://sling.apache.org/jcr/sling/1.0"
            xmlns:jcr="http://www.jcp.org/jcr/1.0"
            xmlns:nt="http://www.jcp.org/jcr/nt/1.0"
            jcr:primaryType="nt:unstructured"
            jcr:title="Item Dialog"
            sling:resourceType="cq/gui/components/authoring/dialog">
            <!-- normal Granite UI dialog definition comes here !-->
    </jcr:root>
``` 

Example item dialog:

![multifield dialog](docs/item.png)

#### Storage
In the repository the content is stored like this:

![content](docs/repo.png)


### Requirements
* AEM 6.3 with Touch UI

### Development
Build locally with Maven
```
    mvn clean install -PautoInstallBundle
```
