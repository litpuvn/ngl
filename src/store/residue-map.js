/**
 * @file Residue Map
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 * @private
 */


import ResidueType from "./residue-type.js";


function ResidueMap( structure ){

    var idDict = {};
    var typeList = [];

    function getHash( resname, atomTypeIdList, hetero, chemCompType ){
        return (
            resname + "|" +
            atomTypeIdList.join( "," ) + "|" +
            ( hetero ? 1 : 0 ) + "|" +
            ( chemCompType ? chemCompType : "" )
        );
    }

    function add( resname, atomTypeIdList, hetero, chemCompType, bonds ){
        resname = resname.toUpperCase();
        var hash = getHash( resname, atomTypeIdList, hetero, chemCompType );
        var id = idDict[ hash ];
        if( id === undefined ){
            var residueType = new ResidueType(
                structure, resname, atomTypeIdList, hetero, chemCompType, bonds
            );
            id = typeList.length;
            idDict[ hash ] = id;
            typeList.push( residueType );
        }
        return id;
    }

    function get( id ){
        return typeList[ id ];
    }

    // API

    this.add = add;
    this.get = get;

    this.list = typeList;
    this.dict = idDict;

    this.toJSON = function(){
        var output = {
            metadata: {
                version: 0.1,
                type: 'ResidueMap',
                generator: 'ResidueMapExporter'
            },
            idDict: idDict,
            typeList: typeList.map( function( residueType ){
                return residueType.toJSON();
            } )
        };
        return output;
    };

    this.fromJSON = function( input ){
        idDict = input.idDict;
        typeList = input.typeList.map( function( input ){
            return new ResidueType(
                structure, input.resname, input.atomTypeIdList, input.hetero
            );
        } );
        this.list = typeList;
        this.dict = idDict;
    };

}


export default ResidueMap;
