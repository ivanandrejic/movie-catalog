package com.demo.catalog;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = App.class)
@AutoConfigureMockMvc
public class HomeControllerTest {
    
	@Autowired
    private MockMvc mockMvc;

    @Test
    public void testLogin() throws Exception {
    	mockMvc.perform(get("/user").secure(true).with(httpBasic("admin", "demo")))
			.andDo(print())
			.andExpect(status().isOk())
			.andExpect(content().json("{\"role\":\"ROLE_ADMIN\"}"))
		;
    }

	    
	    
}
