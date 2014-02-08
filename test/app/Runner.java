import org.apache.velocity.app.Velocity;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.Template;

import org.apache.velocity.exception.ParseErrorException;
import org.apache.velocity.exception.ResourceNotFoundException;

import java.io.*;
import java.util.LinkedHashMap;

public class Runner {
    public Runner(String templateFile) {
        try {
            /*
             * setup
             */

            Velocity.init("velocity.properties");


            /*
            "a"=>"1", 
            "b"=>"2","c"=>"3", "name"=>"wangjeaf", "sex"=>"male", "map"=>array("a"=>"1", "b"=>"2"));
             */
            VelocityContext context = new VelocityContext();

            VelocityContext context2 = new VelocityContext();

            context2.put("a", "<h2>helloA</h2>");
            context2.put("b", "2");
            context2.put("c", "2322");

            context.put("_root", context2);

            Template template =  null;

            try
            {
                template = Velocity.getTemplate(templateFile);
            }
            catch( ResourceNotFoundException rnfe )
            {
                System.out.println("Runner : error : cannot find template " + templateFile );
            }
            catch( ParseErrorException pee )
            {
                System.out.println("Runner : Syntax error in template " + templateFile + ":" + pee );
            }

            BufferedWriter writer = writer = new BufferedWriter(
                new OutputStreamWriter(System.out));

            if ( template != null)
                template.merge(context, writer);

            writer.flush();
            writer.close();
        }
        catch( Exception e )
        {
            System.out.println(e);
        }
    }

    public LinkedHashMap<String,String> getNames()
    {
        LinkedHashMap<String,String> list = new LinkedHashMap<String,String>();

        list.put("a", "1");
        list.put("b", "1");
        list.put("c", "1");
        list.put("d", "1");
        list.put("e", "1");

        return list;
    }

    public static void main(String[] args)
    {
        Runner t = new Runner(args[0]);
    }
}
