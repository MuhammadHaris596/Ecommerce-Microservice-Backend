
import { IsEmail,IsString,IsNotEmpty } from 'class-validator';



export class  RegisterDto {

    @IsNotEmpty()
    @IsString()
    name : string;

    @IsNotEmpty()
    @IsString()
    username : string;

    @IsNotEmpty()
    @IsEmail()

    
    email : string ;
    
    @IsNotEmpty()
    @IsString()

    password : string ;

}


export class LoginDto {

     @IsNotEmpty()
     @IsString()
    

    email : string ;

    @IsNotEmpty()
    @IsString()
   

    password : string ;

}

