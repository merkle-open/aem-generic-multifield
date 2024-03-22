# Generic Multifield for AEM 6.4

| System     | Status                                                                                                                                                                                                                                                                |
|------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| CI master  | [![release and deploy](https://github.com/merkle-open/aem-generic-multifield/actions/workflows/release-and-deploy-release.yml/badge.svg?branch=6.4%2Fmaster)](https://github.com/merkle-open/aem-generic-multifield/actions/workflows/release-and-deploy-release.yml) |
| CI develop | [![deploy snapshot](https://github.com/merkle-open/aem-generic-multifield/actions/workflows/deploy-snapshot.yml/badge.svg?branch=6.4%2Fdevelop)](https://github.com/merkle-open/aem-generic-multifield/actions/workflows/deploy-snapshot.yml)                         |
| Dependency | [![Maven Central](https://maven-badges.herokuapp.com/maven-central/com.namics.oss.aem/genericmultifield/badge.svg?version=2.0.4)](https://search.maven.org/artifact/com.namics.oss.aem/genericmultifield/2.0.4/bundle)                                                |

With this project you can use a widget in [Adobe Experience Manager 6.4](https://helpx.adobe.com/experience-manager/6-4/release-notes.html) Touch UI which lets you create a generic multifield in a dialog.

## Usage

### Maven Dependency
```
    <dependency>
      <groupId>com.namics.oss.aem</groupId>
      <artifactId>genericmultifield</artifactId>
      <version>2.0.4-SNAPSHOT</version>
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

 
#### Component Dialog
Example usage of the Generic Multifield in your component _cq_dialog.xml definition within AEM 6.4 (with Touch UI):
```xml
<!-- Within the component dialog definition -->
<title
       jcr:primaryType="nt:unstructured"
       sling:resourceType="granite/ui/components/coral/foundation/form/textfield"
       fieldLabel="Title"
       name="./title"/>
<genericmultifield
       jcr:primaryType="nt:unstructured"
       sling:resourceType="namics/genericmultifield"
       fieldLabel="Generic Multifield"
       fieldDescription="A list of generic multfield items"
       itemDialog="/your/project/path/component/item-dialog.xml"
       itemNameProperty="itemTitle"
       minElements="2"
       maxElements="5"
       required="{Boolean}true"
       itemStorageNode="./items"/>
```

![main dialog](docs/main.png)

##### Properties
**itemDialog**: path reference to the dialog definition of a generic multifield item.<br />
**itemNameProperty**: Defines the value representation of a generic multifield entry within the component dialog. Must be a reference to a item dialog property.<br />
**minElements**: Defines the min amount of generic multifield entries.<br />
**maxElements**: Defines the max amount of generic multifield entries.<br />
**required**: If set to "{Boolean}true", the main component dialog will not validate until at least one item hast been defined.<br />
**itemStorageNode**: Defines the parent node name created within the component node. Generic multifield items will be save beneath this node.<br />

#### Item-Dialog
```xml
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:sling="http://sling.apache.org/jcr/sling/1.0"
          xmlns:jcr="http://www.jcp.org/jcr/1.0"
          xmlns:nt="http://www.jcp.org/jcr/nt/1.0"
          jcr:primaryType="nt:unstructured"
          sling:resourceType="cq/gui/components/authoring/dialog"
          jcr:title="Item Dialog">
    <content
            jcr:primaryType="nt:unstructured"
            sling:resourceType="granite/ui/components/coral/foundation/tabs">
        <items
                jcr:primaryType="nt:unstructured">
            <basicTab
                    jcr:primaryType="nt:unstructured"
                    sling:resourceType="granite/ui/components/coral/foundation/fixedcolumns"
                    margin="{Boolean}true"
                    jcr:title="Basic">
                <items
                        jcr:primaryType="nt:unstructured">
                    <column
                            jcr:primaryType="nt:unstructured"
                            sling:resourceType="granite/ui/components/coral/foundation/container">
                        <items jcr:primaryType="nt:unstructured">
                            <itemTitle
                                    jcr:primaryType="nt:unstructured"
                                    sling:resourceType="granite/ui/components/coral/foundation/form/textfield"
                                    fieldLabel="Item Title"
                                    fieldDescription="Item Title Description"
                                    required="{Boolean}true"
                                    name="./itemTitle"/>
                            <itemText
                                    jcr:primaryType="nt:unstructured"
                                    sling:resourceType="granite/ui/components/coral/foundation/form/textarea"
                                    fieldLabel="Item Text"
                                    fieldDescription="Item Text Description"
                                    name="./itemText"/>
                            <itemPath
                                    jcr:primaryType="nt:unstructured"
                                    sling:resourceType="granite/ui/components/coral/foundation/form/pathbrowser"
                                    fieldLabel="Item Path"
                                    fieldDescription="Item Path Description"
                                    name="./item Path"/>
                        </items>
                    </column>
                </items>
            </basicTab>
        </items>
    </content>
</jcr:root>
``` 

![multifield dialog](docs/item.png)

#### Storage
In the repository the content is stored as follows:

![content](docs/repo.png)


### Requirements
* AEM 6.4 (Touch UI)

### Development
Build locally with Maven
```
    mvn clean install -PautoInstallBundle
``` 
